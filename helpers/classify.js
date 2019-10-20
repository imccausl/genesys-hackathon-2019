require("dotenv").config();
const _request = require("request");
const { promisify } = require("util");
const { CLASSIFIER_API_ENDPOINT } = require("../helpers/constants");

const request = promisify(_request);

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
  const isRelevant =
    classification.includes("question") || classification.includes("statement");
  const isQuestion = classification.includes("question");

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
      answer = classification.text;
      return { question, answer };
    }
  };
};

module.exports = getQuestionAnswerPair;
