var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Home page of Assessment Manager");
});

router.put("/", (req, res) => {

});

router.post("/", (req, res) => {

});

router.delete("/", (req, res) => {

});

module.exports = router;