var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {isAuthenticated} = require('../authorize')
const {candidateFilter} = require('../controllers/cardsFilterController');


router.post("/", jsonParser, candidateFilter )


module.exports = router;
