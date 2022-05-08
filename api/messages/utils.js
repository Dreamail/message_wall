//import CryptoJS from "crypto-js/crypto-js";
//import axios from "axios";

const CryptoJS = require("crypto-js/crypto-js");
const axios = require("axios");

const DB_KEY = process.env.DB_KEY;
const DB_ACC = process.env.DB_ACC;
const DB_NAME = process.env.DB_NAME;

var getAuthorizationTokenUsingMasterKey = function (
  verb,
  resourceType,
  resourceId,
  dateTime
) {
  var text =
    (verb || "").toLowerCase() +
    "\n" +
    (resourceType || "").toLowerCase() +
    "\n" +
    (resourceId || "") +
    "\n" +
    dateTime.toLowerCase() +
    "\n\n";

  var hash = CryptoJS.HmacSHA256(text, CryptoJS.enc.Base64.parse(DB_KEY));
  var signature = CryptoJS.enc.Base64.stringify(hash);

  var MasterToken = "master";

  var TokenVersion = "1.0";

  return encodeURIComponent(
    "type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + signature
  );
};

var continuation = "";

const getMsg = () => {
  const dateTime = new Date().toUTCString();
  const auth = getAuthorizationTokenUsingMasterKey(
    "get",
    "docs",
    `dbs/${DB_NAME}/colls/massages`,
    dateTime
  );

  const resBody = axios
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
          //"x-ms-documentdb-partitionkey": [""],
          "x-ms-max-item-count": 4,
          "x-ms-continuation": continuation,
        },
      }
    )
    .then((res) => {
      continuation = res.headers["x-ms-continuation"];
      return res;
    });

  return resBody;
};

exports = { getAuthorizationTokenUsingMasterKey, getMsg };
