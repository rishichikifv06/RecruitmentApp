var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {saveEndAssessment} = require('../controllers/assessmentController');


router.post("/endAssessment",jsonParser, saveEndAssessment )


module.exports = router;