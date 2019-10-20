var express = require("express");
var router = express.Router();
const analyze = require("../helpers/analyze");
const postToSlack = require("../helpers/postToSlack")(
  "xoxb-801358426645-788633069618-2aHNJosorn91XtNiDxoy4auS"
);
const { askKnowledgeBase } = require("../helpers/search");
const { KNOWLEDGE_BASES, HANDOFF_THRESHOLD } = require("../helpers/constants");
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
  const slackUserId = req.body.originalDetectIntentRequest.payload.data
    ? req.body.originalDetectIntentRequest.payload.data.event.user
    : null;

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
      result: [
        result
          ? `USER: ${req.body.queryResult.queryText}\nME: ${result.fulfillmentText}`
          : `USER: ${req.body.queryResult.queryText}\n`
      ],
      score: score.Score
    };
  } else {
    global.session[sessionId]["result"].push(
      result
        ? `USER: ${req.body.queryResult.queryText}\nME: ${result.fulfillmentText}`
        : `USER: ${req.body.queryResult.queryText}\n`
    );
    global.session[sessionId]["score"] += score.Score / 2;
  }
  console.log(global.session[sessionId]["result"]);
  console.log("Cumulative score:", global.session[sessionId]["score"]);

  if (global.session[sessionId]["score"] <= HANDOFF_THRESHOLD) {
    const responseArray = global.session[sessionId]["result"].filter(
      item => item !== ""
    );
    const responsesString = "```" + responseArray.join("\n") + "```";
    await postToSlack(
      "UPKAK704V",
      `<@UPKAK704V> I need some help over here! Sentiment score has dropped to ${
        global.session[sessionId]["score"]
      } :frowning: ${
        slackUserId ? `Can you help <@${slackUserId}> out for me?` : ""
      }`,
      true
    );

    await postToSlack(
      "UPKAK704V",
      `This was our last chat: ${responsesString}`,
      true
    );

    global.session[sessionId]["score"] = 0;
    return res.json({});
  }

  res.json(result);
});

module.exports = router;
