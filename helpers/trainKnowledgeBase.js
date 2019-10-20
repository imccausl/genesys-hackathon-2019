require("dotenv").config();
const _request = require("request");
const { promisify } = require("util");

const request = promisify(_request);
const { API } = require("./constants");
const { TOKEN, ORG_ID } = process.env;

const trainKnowledgeBase = async kbId => {
  const options = {
    method: "POST",
    url: `${API.root}${API.trainKnowledgeBase(kbId)}`,
    headers: {
      Connection: "keep-alive",
      "Content-Length": "0",
      "Accept-Encoding": "gzip, deflate",
      Host: "api.genesysappliedresearch.com",
      Accept: "*/*",
      "User-Agent": "PostmanRuntime/7.18.0",
      token: TOKEN,
      organizationid: ORG_ID,
      "Content-Type": "application/json"
    }
  };

  const response = await request(options);
  return response.body;
};

module.exports = trainKnowledgeBase;
