require("dotenv").config();
const _request = require("request");
const { promisify } = require("util");
const {
  CLASSIFIER_API_ENDPOINT,
  KNOWLEDGE_BASES
} = require("../helpers/constants");
const updateKnowledgeBase = require("./updateKnowledgeBase");
const trainKnowledgeBase = require("./trainKnowledgeBase");
const postToSlack = require("./postToSlack")(process.env.QUESTION_MAKER_TOKEN);
console.log(process.env.QUESTION_MAKER_TOKEN);

const request = promisify(_request);
const kbId = KNOWLEDGE_BASES.slack;

const classify = async text => {
  const options = {
    method: "POST",
    url: `${CLASSIFIER_API_ENDPOINT}`,
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      text
    },
    json: true
  };

  const result = await request(options);
  const classification = result.body.classification.toLowerCase();
  console.log("DEBUG ** classification: ", classification);
  // right now we use question and statement as answer
  // other classifications include "reject" and "greeting"
  const isRelevant = true;
  //classification.includes("question") || classification.includes("statement");
  const isQuestion =
    classification.includes("question") || classification.includes("clarify");

  return { text, isRelevant, isQuestion };
};

const getQuestionAnswerPair = () => {
  let question = null;
  let answer = null;

  return async input => {
    const classification = await classify(input);
    if (classification.isRelevant && classification.isQuestion) {
      question = classification.text;
    }

    if (classification.isRelevant && !classification.isQuestion && question) {
      answer = classification.text.replace(/\n/g, " ");
      const pair = { question, answer };
      console.log(pair);
      const result = await updateKnowledgeBase(kbId, pair);
      await postToSlack(
        "finance",
        "Nice! A new question/answer pair has been added! Re-training the model!"
      );
      const train = await trainKnowledgeBase(kbId);
      return result.body;
    }
  };
};

module.exports = getQuestionAnswerPair;
