var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {interviewFilter} = require('../controllers/interviewFilterController');



router.post("/", jsonParser, interviewFilter );


module.exports = router;
