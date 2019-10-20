const express = require("express");
const router = express.Router();
const getQuestionAnswerPair = require("../helpers/classify")();

/* GET users listing. */
router.post("/", async function(req, res, next) {
  const { challenge } = req.body;
  if (challenge) {
    return res.json({
      challenge
    });
  }

  const { event } = req.body;
  console.log(1, event);
  if (event && event.type === "message") {
    console.log(2, event.text);
    const { text, subtype } = event;
    if (!subtype) {
      console.log(3, event.subtype);
      const result = await getQuestionAnswerPair(text);
      console.log(1, result);

      if (result) {
        return res.json(result);
      }
    }
  }

  res.json(req.body);
});

module.exports = router;
