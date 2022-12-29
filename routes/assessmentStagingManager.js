var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {fetchQaFromAssessmentStaging,saveScoreNoteInAssessmentStaging} = require('../controllers/assessmentStagingController');

router.post("/", jsonParser,  fetchQaFromAssessmentStaging )

router.post("/saveData", jsonParser, saveScoreNoteInAssessmentStaging )

module.exports = router;
