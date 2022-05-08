import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import * as HmacSHA256 from "crypto-js/hmac-sha256";
import * as Base64 from "crypto-js/enc-base64";

import axios from "axios";

const DB_KEY = process.env.DB_KEY;
const DB_ACC = process.env.DB_ACC;
const DB_NAME = process.env.DB_NAME;

const getAuthorizationTokenUsingMasterKey = (
  verb: string,
  resourceType: string,
  resourceId: string,
  dateTime: string
) => {
  var text =
    (verb || "").toLowerCase() +
    "\n" +
    (resourceType || "").toLowerCase() +
    "\n" +
    (resourceId || "") +
    "\n" +
    dateTime.toLowerCase() +
    "\n\n";

  var hash = HmacSHA256(text, Base64.parse(DB_KEY));
  var signature = Base64.stringify(hash);

  var MasterToken = "master";

  var TokenVersion = "1.0";

  return encodeURIComponent(
    "type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + signature
  );
};

const getMsg = (continuation: string) => {
  const dateTime = new Date().toUTCString();
  const auth = getAuthorizationTokenUsingMasterKey(
    "get",
    "docs",
    `dbs/${DB_NAME}/colls/messages`,
    dateTime
  );

  const res = axios
    .get(
      `https://${DB_ACC}.documents.azure.com/dbs/${DB_NAME}/colls/messages/docs`,
      {
        headers: {
          authorization: auth,
          "Content-Type": "application/query+json",
          "x-ms-documentdb-isquery": true,
          "x-ms-version": "2018-12-31",
          "x-ms-date": dateTime,
          Accept: "application/json",
          "Cache-Control": "no-cache",
          "x-ms-max-item-count": 4,
          "x-ms-continuation": continuation,
        },
      }
    );

  return res;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await getMsg(req.headers["continuation"])
    .then((res) => {
      context.log(res);
      context.res = {
        status: res.status,
        body: res.data,
        headers: {
          "continuation": res.headers["x-ms-continuation"]
        }
      };
    })
    .catch((res) => {
      context.log(res);
    });
};

export default httpTrigger;
