var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {fetchComplexities,addComplexityToDb} = require('../controllers/complexityController');


router.get("/", fetchComplexities )

router.post("/addcmp", jsonParser, addComplexityToDb )

module.exports = router;