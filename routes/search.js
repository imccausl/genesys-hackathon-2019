const express = require("express");
const router = express.Router();
const { askKnowledgeBase } = require("../helpers/search");

router.post("/:kbId/", async function(req, res, next) {
  const { question } = req.body;
  const { kbId } = req.params;

  try {
    console.log(question, kbId);
    const result = await askKnowledgeBase(kbId, question);

    res.json({
      status: "success",
      message: result
    });
  } catch (e) {
    res.json({
      status: "error",
      message: e
    });
  }
});

module.exports = router;
