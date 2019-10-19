var express = require("express");
var router = express.Router();

/* GET home page. */
// router.get("/", function(req, res, next) {
//   res.render("index", { title: "Hackathon App" });
// });
router.get("/", function(req, res, next) {
  res.json({ title: "Hackathon App" });
});

module.exports = router;
