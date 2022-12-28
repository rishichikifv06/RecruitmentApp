var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {fetchSkills,addSkillToDb} = require('../controllers/skillsController')

router.get("/",fetchSkills);

router.post("/addSkill",jsonParser,addSkillToDb );

module.exports = router;
