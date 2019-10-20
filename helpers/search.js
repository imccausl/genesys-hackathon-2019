require("dotenv").config();
const _request = require("request");
const { promisify } = require("util");

const request = promisify(_request);
const {
  API,
  CONFIDENCE_THRESHOLD,
  CONFIDENCE_LOWER_THRESHOLD
} = require("../helpers/constants");

const { ORG_ID } = process.env;

function getSearchPayload(result, shouldFallback) {
  if (result && result.confidence && result.confidence > CONFIDENCE_THRESHOLD) {
    return {
      fulfillmentText: result.faq.answer
    };
  } else if (
    result &&
    !shouldFallback &&
    result.confidence &&
    result.confidence > CONFIDENCE_LOWER_THRESHOLD
  ) {
    return {
      fulfillmentText: "You might meant to ask: " + result.faq.question
    };
  }
  if (shouldFallback) return;
  return {
    fulfillmentText:
      "I'm sorry, I could not find any results. Can you please rephrase your question?"
  };
}

function getFBI(result, fbiAgentCode) {
  if (result && result.confidence && result.confidence > 0.6) {
    if (
      result.categories.length &&
      fbiAgentCode.toLowerCase() !== result.categories[0].name.toLowerCase()
    ) {
      return {
        fulfillmentText:
          "I'm sorry, it is classified on your level. You are not allowed to access this information."
      };
    }
    return {
      fulfillmentText: result.faq.answer
    };
  } else if (
    result &&
    result.confidence &&
    result.confidence > CONFIDENCE_LOWER_THRESHOLD
  ) {
    return {
      fulfillmentText: "Do you mean to ask: " + result.faq.question
    };
  }
  return {
    fulfillmentText:
      "I'm sorry, it is classified on your level. You are not allowed to access this information."
  };
}

async function askKnowledgeBase(kbId, query, shouldFallback, fbiAgentCode) {
  const options = {
    method: "POST",
    url: `${API.root}${API.searchKnowledgeBase(kbId)}`,
    headers: {
      token: process.env.TOKEN,
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
    if (result.body && !result.body.errorMessage) {
      if (fbiAgentCode) return getFBI(result.body.results[0], fbiAgentCode);
      return getSearchPayload(result.body.results[0], shouldFallback);
    }

    if (result.body && result.body.errorMessage) {
      return {
        fulfillmentText: result.body.errorMessage
      };
    }
  } catch (e) {
    return {
      fulfillmentText:
        "You know humans, they make errors! It is one of them. please try again."
    };
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
