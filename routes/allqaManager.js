var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var { allQA } = require('../controllers/allQAController')

router.post("/allQAC", jsonParser, allQA)
  
module.exports = router;
