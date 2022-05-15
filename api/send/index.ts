import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const DB_KEY = process.env.DB_KEY;
const DB_ACC = process.env.DB_ACC;
const DB_NAME = process.env.DB_NAME;

const sendMsg = async (msg: {
  id?: string;
  data: {
    title: string;
    subtitle: string;
    description: string;
    imagesrc: string[];
  };
  ip: string;
  userid: string;
  _partitionKey?: string;
}) => {
  msg._partitionKey = "";
  const client = new CosmosClient({
    endpoint: `https://${DB_ACC}.documents.azure.com/`,
    key: DB_KEY,
  });
  const user: {
    id: string;
    ip: string;
    ban: boolean;
  } = (
    await client
      .database(DB_NAME)
      .container("users")
      .item(msg.userid, "")
      .read()
  ).resource;
  if (user != undefined) {
    if (user.ban != undefined) {
      if (user.ban) {
        return false;
      }
    }
  }
  await client
    .database(DB_NAME)
    .container("users")
    .items.upsert({
      id: msg.userid,
      ip: msg.ip,
      ban: false,
      _partitionKey: "",
    })
    .catch(() => {
      return;
    });
  client.database(DB_NAME).container("messages").items.create(msg);
  return true;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (req.body.userid == undefined || req.body.userid == "") {
    context.res = {
      status: 403,
      ok: false,
    };
    return;
  }
  await sendMsg(req.body).then((value) => {
    context.res = {
      status: value ? 200 : 403,
      ok: value,
    };
  });
};

export default httpTrigger;
