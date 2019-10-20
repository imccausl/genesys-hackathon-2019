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
  if (event && event.type === "message") {
    const { text, subtype } = event;
    if (!subtype) {
      const result = await getQuestionAnswerPair(text);

      if (result) {
        return res.json(result);
      }
    }
  }

  res.json(req.body);
});

module.exports = router;
