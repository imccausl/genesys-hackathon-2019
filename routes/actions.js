var express = require("express");
var router = express.Router();
const { askKnowledgeBase } = require("../helpers/search");
const { KNOWLEDGE_BASES } = require("../helpers/constants");
var { updateAnalytics } = require("../helpers/analytics");

/* GET users listing. */
router.post("/", async function(req, res, next) {
  updateAnalytics(req.body.queryResult.queryText);
  if (
    req.body.queryResult.action &&
    req.body.queryResult.action.includes("smalltalk")
  )
    return res.json(req.body.queryResult);
  if (
    req.body.queryResult.action === "input.unknown" &&
    req.body.queryResult.originalDetectIntentRequest.source ===
      "GOOGLE_TELEPHONY"
  )
    res.json({
      fulfillmentText: "Welcome to the future! I'm Genesys, how can I help you?"
    });
  const result = await askKnowledgeBase(
    KNOWLEDGE_BASES.slack,
    req.body.queryResult.queryText,
    req.body.originalDetectIntentRequest.payload.data
      ? req.body.originalDetectIntentRequest.payload.data.event.channel_type ===
          "channel"
      : false
  );
  res.json(result);
});

module.exports = router;
