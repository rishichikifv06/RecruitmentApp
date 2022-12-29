var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');
const {fetchAllQa,insertQaToDb,updateQInDb,updateAInDb} = require('../controllers/qaController');



router.post("/allQA", jsonParser, fetchAllQa )

router.post("/insertQA", jsonParser, insertQaToDb )


//update a question using question id
router.post("/updateQ", jsonParser, updateQInDb )

//update answer using answer Id
router.post("/updateA", jsonParser, updateAInDb )

module.exports = router;
