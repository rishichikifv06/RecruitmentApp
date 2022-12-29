var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {scheduleInterviewForCandidate,fetchInterviewSkills} = require('../controllers/candidateInterviewController');


router.post("/addInterview", jsonParser, scheduleInterviewForCandidate )

router.post('/getInterviewSkills', jsonParser, fetchInterviewSkills )


 module.exports=router;