var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Home page of Profile Manager");
});

router.put("/", (req, res) => {

});

router.post("/", (req, res) => {

});

router.delete("/", (req, res) => {

});

module.exports = router;