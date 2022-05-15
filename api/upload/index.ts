import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { CosmosClient } from "@azure/cosmos";

const DB_KEY = process.env.DB_KEY;
const DB_ACC = process.env.DB_ACC;
const DB_NAME = process.env.DB_NAME;

const BLOB_STR = process.env.BLOB_STR;

const upload = async (name: string, data: ArrayBuffer) => {
  const serviceClient = BlobServiceClient.fromConnectionString(BLOB_STR);
  const containerClient = serviceClient.getContainerClient("images");
  const blockClient = containerClient.getBlockBlobClient(name);
  return blockClient.upload(data, data.byteLength);
};

const check = async (userid: string, ip: string): Promise<boolean> => {
  const client = new CosmosClient({
    endpoint: `https://${DB_ACC}.documents.azure.com/`,
    key: DB_KEY,
  });
  const user: {
    id: string;
    ip: string;
    ban: boolean;
  } = (
    await client.database(DB_NAME).container("users").item(userid, "").read()
  ).resource;
  if (user != undefined) {
    console.log("user undefined");
    if (user.ban != undefined) {
      console.log("ban undefined");
      if (user.ban) {
        console.log("user banned");

        return false;
      }
    }
  }
  await client
    .database(DB_NAME)
    .container("users")
    .items.upsert({
      id: userid,
      ip: ip,
      ban: false,
      _partitionKey: "",
    })
    .catch(() => {
      return true;
    });

  return true;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (!(await check(req.headers["userid"], req.headers["ip"]))) {
    context.log("check failed");
    context.res = {
      status: 403,
      ok: false,
    };
    return;
  }

  const buffer = Buffer.from((req.body as string).split(",")[1], "base64");
  await upload(req.headers["filename"], buffer);
};

export default httpTrigger;
