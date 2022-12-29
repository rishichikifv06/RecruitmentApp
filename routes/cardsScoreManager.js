var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {fetchScoresForCandidate} = require('../controllers/cardsScoreController');

router.post('/scores', jsonParser, fetchScoresForCandidate )


 module.exports = router;
