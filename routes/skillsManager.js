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


router.post("/addSkill", (req, res)=>{
  const skillName = req.body.skillName;
  async function AddSkill()
  {
    await ConnectToDb().then(async (dbConnection)=>{
      if(dbConnection){
        await ExecuteQuery(dbConnection, `select skillName from Skill where skillName='${skillName}'`)
        .then(async (selectedSkill)=>{
          if(selectedSkill.length!=0){
            console.log(selectedSkill);
            var status = {
              Message: "The skill is already present!!"
            }
            res.status(200).json(status);
            dbConnection.close();
          }
          else{
            await ExecuteQuery(dbConnection, `insert into Skill(skillName) values('${skillName}') `)
            .then((result)=>{
                var status ={
                  "status":"success",
                  "Message":"new skill is added"
                }
                res.status(200).json(status);
                console.log(status);
              dbConnection.close();
            })
            .catch((err)=>{
              console.log(err);
              res.status(500).json(err);
              dbConnection.close();
            })

          }

        })
      }
     }).catch((err)=>{
      console.log(err);
      dbConnection.close();
     })
  }
  AddSkill();
})

module.exports = router;
