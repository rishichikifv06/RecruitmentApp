var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const {
  fetchAllListDetail,
  fetchListDetailByMasterId,
  deleteListDetailByListDtlId,
  addListDetailToDb,
  updListDetailToDb,
} = require("../controllers/listDataDetailController");

//fetch all records
router.get("/fetchAllListDetail", fetchAllListDetail);

//fetch records  by  List Master ID
router.get("/fetchListDetail/:ListMstId", fetchListDetailByMasterId);

//Delete record by list master ID
router.delete("/deleteListDetail/:ListDtlId", deleteListDetailByListDtlId);

//add listdatadetail record
router.post("/addListDetail", jsonParser, addListDetailToDb);

//update listdatadetail
router.put("/updateListDetail", jsonParser, updListDetailToDb);

module.exports = router;