require("dotenv").config();
const _request = require("request");
const { promisify } = require("util");
const request = promisify(_request);
const { API } = require("./constants");
const { TOKEN, ORG_ID } = process.env;

const updateKnowledgeBase = async (kbId, { question, answer }) => {
  const options = {
    method: "POST",
    url: `${API.root}${API.updateKnowledgeBase(kbId)}`,
    headers: {
      token: TOKEN,
      organizationid: ORG_ID,
      "Content-Type": "application/json"
    },
    body: {
      type: "faq",
      faq: {
        question,
        answer,
        alternatives: []
      },
      externalUrl: ""
    },
    json: true
  };

  const result = await request(options);
  console.log(result);
  return result;
};

module.exports = updateKnowledgeBase;
