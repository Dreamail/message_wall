import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const DB_KEY = process.env.DB_KEY;
const DB_ACC = process.env.DB_ACC;
const DB_NAME = process.env.DB_NAME;

const getMsg = async (continuation: string) => {
  const client = new CosmosClient({
    endpoint: `https://${DB_ACC}.documents.azure.com/`,
    key: DB_KEY,
  });
  const resp = await client
    .database(DB_NAME)
    .container("messages")
    .items.changeFeed("", {
      startFromBeginning: true,
      continuation: continuation,
      maxItemCount: 4,
    })
    .fetchNext();

  return resp;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await getMsg(req.headers["continuation"])
    .then((msgResp) => {
      context.res = {
        body: msgResp.result,
        headers: {
          continuation: msgResp.continuation,
        },
      };
    })
    .catch((res) => {
      context.log(res);
    });
};

export default httpTrigger;
