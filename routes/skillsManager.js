var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');


router.get("/", (req, res)=>{

  async function getAllSkills()
  {
 
    await ConnectToDb().then(async (dbConnection)=>{
      if(dbConnection){
        await ExecuteQuery(dbConnection, `SELECT * FROM Skill`)
        .then((result)=>{
          res.status(200).json({result});
          dbConnection.close();
        })
        .catch((err)=>{
          console.log(err);
          res.status(500).json(err);
          dbConnection.close();
        })
      }
      else{
        console.log("Not connected to db");
      }
     }).catch((err)=>{
      console.log(err);
      dbConnection.close();
     })

  }
 
  getAllSkills();
})



module.exports = router;
