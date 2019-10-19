var express = require("express");
var router = express.Router();
var analyze = require("../helpers/analyze");

router.post("/", async function(req, res, next) {
  const { text } = req.body;
  console.log(text);
  try {
    const result = await analyze(text);

    res.json({ status: "success", result });
  } catch (e) {
    res.json({ status: "error", message: e });
  }
});

module.exports = router;
