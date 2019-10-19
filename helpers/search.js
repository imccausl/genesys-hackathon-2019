require("dotenv").config();
const _request = require("request");
const { promisify } = require("util");

const request = promisify(_request);
const { API, CONFIDENCE_THRESHOLD } = require("../helpers/constants");

const { ORG_ID } = process.env;

// for testing without app.js
if (!global.token) {
  global.token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6ImEyZmE3NDg1LTViMWUtNDBiNC1iZTVhLWM0ZmY2NGE2ODY3NSIsImV4cCI6MTU3MTUyNjQzMiwiaWF0IjoxNTcxNTIyODMyfQ.n4ucuhTQLrpEx6UIG7t0REploi7kZy6874vU7GDPRts";
}

function _filterByConfidence(result) {
  if (result && result.confidence && result.confidence > CONFIDENCE_THRESHOLD) {
    return { result };
  }

  return {
    KnowledgeBase: result && result.KnowledgeBase ? result.KnowledgeBase : null,
    faq: "I'm sorry, I didn't understand that. Can you try a different wording?"
  };
}

async function askKnowledgeBase(kbId, query) {
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

  try {
    const result = await request(options);
    console.log(result);
    if (result.body && !result.body.errorMessage) {
      return {
        query: result.body.query,
        result: _filterByConfidence(result.body.results[0])
      };
    }

    if (result.body && result.body.errorMessage) {
      throw new Error(result.body.errorMessage);
    }
  } catch (e) {
    return { status: "error", message: e };
  }
}

// FOR TESTING
// const ask = async () => {
//   const faq = await askKnowledgeBase(
//     "1995df85-0984-4683-baa5-dc87a94b183d",
//     "How do I go on vacation?"
//   );

//   console.log(faq);
// };

// ask();

module.exports = { askKnowledgeBase };
