const express = require("express");
const {
  ListDataValues,
  getMasterDataByCode,
  postListData,
  updateDataMaster,
  deleteMasterData,
} = require("../controllers/ListDataMasterController");

const router = express.Router();

router.get("/fetchalllistdatamaster", ListDataValues);

router.get("/listdatamaster/:masterid", getMasterDataByCode);

router.post("/postdatamaster", postListData);

router.put("/updateDataMaster/:masterid", updateDataMaster);

router.delete("/deleteRecord/:masterId", deleteMasterData);

module.exports = router;