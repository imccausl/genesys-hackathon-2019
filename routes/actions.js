var express = require("express");
var router = express.Router();
const { askKnowledgeBase } = require("../helpers/search");
const { KNOWLEDGE_BASES } = require("../helpers/constants");
var { updateAnalytics } = require("../helpers/analytics");

/* GET users listing. */
router.post("/", async function(req, res, next) {
  updateAnalytics(req.body.queryResult.queryText);
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
