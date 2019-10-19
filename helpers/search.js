require("dotenv").config();
const request = require("request");
const { API } = require("../helpers/constants");

const { ORG_ID } = process.env;

if (!global.token) {
  global.token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6ImEyZmE3NDg1LTViMWUtNDBiNC1iZTVhLWM0ZmY2NGE2ODY3NSIsImV4cCI6MTU3MTUyMTgzNCwiaWF0IjoxNTcxNTE4MjM0fQ.OGrzUgUgulu-rZj0zOMnQSw4JwVngulcG_FgU-xyOpE";
}

function askKnowledgeBase(kbId, query) {
  const options = {
    method: "POST",
    url: `${API.root}${API.searchKnowledgeBase(kbId)}`,
    headers: {
      token: global.token,
      organizationid: ORG_ID,
      "Content-Type": "application/json"
    },
    body: {
      query,
      pageSize: 5,
      pageNumber: 1,
      sortOrder: "string",
      sortBy: "string",
      languageCode: "en-US",
      documentType: "Faq"
    },
    json: true
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    const { KnowledgeBase, faq } = body.results[0];

    console.log(KnowledgeBase, faq);
  });
}

askKnowledgeBase(
  "1995df85-0984-4683-baa5-dc87a94b183d",
  "My computer won't turn on! What do I do?"
);

module.exports = { askKnowledgeBase, findKnowledgeBase };
