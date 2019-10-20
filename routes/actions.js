var express = require("express");
var router = express.Router();
var url = require("url");

const { askKnowledgeBase } = require("../helpers/search");
const { KNOWLEDGE_BASES } = require("../helpers/constants");
var { updateAnalytics } = require("../helpers/analytics");
// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate");

// Creates a client
const translate = new Translate();

/* GET users listing. */
router.post("/", async function(req, res, next) {
  console.log(req.body.queryResult);
  if (req.body.queryResult.languageCode == "ru") {
    let [translations] = await translate.translate(
      req.body.queryResult.queryText,
      "en"
    );
    req.body.queryResult.queryText = translations;
    console.log(translations, req.body.queryResult.queryText);
  }
  if (req.body.queryResult && req.body.queryResult.queryText) {
    updateAnalytics(req.body.queryResult.queryText);
  }
  var url_parts = url.parse(req.url, true);
  console.log(url_parts);
  var query = url_parts.query;
  if (
    req.body.queryResult.action &&
    req.body.queryResult.action.includes("smalltalk")
  )
    return res.json(req.body.queryResult);
  const result = await askKnowledgeBase(
    KNOWLEDGE_BASES[query["kbName"]],
    req.body.queryResult.queryText,
    req.body.originalDetectIntentRequest.payload.data
      ? req.body.originalDetectIntentRequest.payload.data.event.channel_type ===
          "channel"
      : false
  );
  res.json(result);
});

router.post("/fbi", async function(req, res, next) {
  if (req.body.queryResult && req.body.queryResult.queryText) {
    updateAnalytics(req.body.queryResult.queryText);
  }
  const result = await askKnowledgeBase(
    KNOWLEDGE_BASES.fbi,
    req.body.queryResult.queryText,
    null,
    req.body.queryResult.outputContexts[
      req.body.queryResult.outputContexts.length - 1
    ].parameters.CodeName
  );
  res.json(result);
});

module.exports = router;
