require("dotenv").config();
const postToSlack = require("./postToSlack")(process.env.HANDOFF_TOKEN);
const analyze = require("./analyze");
const { HANDOFF_THRESHOLD } = require("./constants");

async function handOff(req, result) {
  const sessionId = req.body.session;
  const score = await analyze(req.body.queryResult.queryText);
  if (!global.session[sessionId]) {
    global.session[sessionId] = {
      result: [
        result
          ? `USER: ${req.body.queryResult.queryText}\nME: ${result.fulfillmentText}`
          : `USER: ${req.body.queryResult.queryText}\n`
      ],
      score: parseFloat(score.Score)
    };
  } else {
    global.session[sessionId]["result"].push(
      result
        ? `USER: ${req.body.queryResult.queryText}\nME: ${result.fulfillmentText}`
        : `USER: ${req.body.queryResult.queryText}\n`
    );
    console.log(
      "*****",
      global.session[sessionId]["score"],
      parseFloat(score.Score)
    );
    global.session[sessionId]["score"] =
      (global.session[sessionId]["score"] + parseFloat(score.Score)) / 2;
  }
  console.log(global.session[sessionId]["result"]);
  console.log("Cumulative score:", global.session[sessionId]["score"]);

  if (
    parseFloat(global.session[sessionId]["score"]) <=
    parseFloat(HANDOFF_THRESHOLD)
  ) {
    const responseArray = global.session[sessionId]["result"].filter(
      item => item !== ""
    );
    const slackUserId = req.body.originalDetectIntentRequest.payload.data
      ? req.body.originalDetectIntentRequest.payload.data.event.user
      : null;
    const responsesString = "```" + responseArray.join("\n") + "```";
    await postToSlack(
      "UPKAK704V",
      `<@UPKAK704V> Boss, I need some help over here! Sentiment score has dropped to ${
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

    global.session[sessionId] = null;
  }
}

module.exports = { handOff };
