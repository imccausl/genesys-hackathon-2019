var express = require("express");
var router = express.Router();
const { askKnowledgeBase } = require("../helpers/search");
const { kbId } = require("../helpers/constants");
var { updateAnalytics } = require("../helpers/analytics");

/* GET users listing. */
router.post("/", async function(req, res, next) {
  updateAnalytics(req.body.queryResult.queryText);
  const result = await askKnowledgeBase(
    kbId.first,
    req.body.queryResult.queryText,
    req.body.originalDetectIntentRequest.payload.data.event.channel_type ===
      "channel"
  );
  res.json(result);
});

module.exports = router;
