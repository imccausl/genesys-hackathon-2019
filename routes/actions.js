var express = require("express");
var router = express.Router();
const analyze = require("../helpers/analyze");
const { askKnowledgeBase } = require("../helpers/search");
const { KNOWLEDGE_BASES } = require("../helpers/constants");
var { updateAnalytics } = require("../helpers/analytics");

/* GET users listing. */
router.post("/", async function(req, res, next) {
  if (req.body.queryResult) {
    updateAnalytics(req.body.queryResult.queryText);
  }
  if (req.body.queryResult.queryText === "TELEPHONY_WARMUP")
    return res.json({});
  if (
    req.body.queryResult.action &&
    req.body.queryResult.action.includes("smalltalk")
  )
    return res.json(req.body.queryResult);
  if (
    req.body.queryResult.action === "input.unknown" &&
    req.body.queryResult.originalDetectIntentRequest &&
    req.body.queryResult.originalDetectIntentRequest.source ===
      "GOOGLE_TELEPHONY"
  )
    res.json({
      fulfillmentText: "Welcome to the future! I'm Genesys, how can I help you?"
    });

  const sessionId = req.body.session;
  const result = await askKnowledgeBase(
    KNOWLEDGE_BASES.slack,
    req.body.queryResult.queryText,
    req.body.originalDetectIntentRequest.payload.data
      ? req.body.originalDetectIntentRequest.payload.data.event.channel_type ===
          "channel"
      : false
  );
  const score = await analyze(req.body.queryResult.queryText);
  console.log(score);
  if (!global.session[sessionId]) {
    global.session[sessionId] = {
      result: [result ? result.fulfillmentText : ""],
      score: score.Score
    };
  } else {
    global.session[sessionId]["result"].push(
      result ? result.fulfillmentText : ""
    );
    global.session[sessionId]["score"] += score.Score / 2;
  }
  console.log(global.session[sessionId]["result"]);
  console.log("Cumulative score:", global.session[sessionId]["score"]);
  res.json(result);
});

module.exports = router;
