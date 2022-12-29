var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {
  createCandidate,
  fetchCandidateSkillAndAssessment,
  statusUpdateCandidate,
  fetchCandidateSkills
} = require("../controllers/candidateController");

router.post("/saveData", jsonParser, createCandidate);

router.post("/candidateSkill", jsonParser, fetchCandidateSkillAndAssessment);

router.post("/updateCandidateStatus", jsonParser, statusUpdateCandidate);

//get candidate skills by candidate id

router.post("/displayCandidateSkills", jsonParser, fetchCandidateSkills);

module.exports = router;
