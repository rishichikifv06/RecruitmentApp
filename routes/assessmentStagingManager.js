var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');


router.post("/", jsonParser, (req, res) => {

   var canId = req.body.canId;
   var RowandQuestion_number = req.body.RowandQuestion_number;

  async function getSingleQandAFromStaging()
  {
    await ConnectToDb().then(async (dbConnection)=>{
      if(dbConnection){
        await ExecuteQuery(dbConnection, `SELECT Questions.Question, Answers.Answer, AssessmentStaging.RowandQuestion_number,Skill.skillName,Complexity.Name , AssessmentStaging.AssessmentStagingstatus ,AssessmentStaging.score, AssessmentStaging.Note
        FROM AssessmentStaging
        LEFT JOIN Questions ON Questions.queId=AssessmentStaging.queId LEFT JOIN Skill ON Questions.skillId=Skill.skillId 
        LEFT JOIN Complexity ON Questions.cmpId=Complexity.cmpId
        LEFT JOIN Answers ON Answers.ansId=AssessmentStaging.ansId
        WHERE canId=${canId} AND RowandQuestion_number = ${RowandQuestion_number}`)
        .then((result)=>{
          result[0].currentRecordId = RowandQuestion_number;
          result[0].firsRecordId = 1;
          result[0].nextRecordId = RowandQuestion_number+1;
          result[0].previosRecordId = RowandQuestion_number-1;
          result[0].lastRecordId = 20;
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
 
  getSingleQandAFromStaging();
})


router.post("/saveData", jsonParser, (req, res)=>{
  var canId = req.body.canId;
  var RowandQuestion_number = req.body.RowandQuestion_number;
  var score = req.body.score;
  var notes = req.body.notes;
  console.log(notes);

  async function getData()
  {
    await sql.open(details.connectionString, async (err, conn)=>{
    await  conn.query(`UPDATE AssessmentStaging SET score=${score} ,Note='${notes}', AssessmentStagingstatus='closed' WHERE canId = ${canId} AND 
    RowandQuestion_number = ${RowandQuestion_number}`,(err, data)=>{
        if(data){
          var success = {
            status: "Success",
            message: `The response is saved successfully for candidateId ${canId} and question number ${RowandQuestion_number}`}

          res.status(200).json(success);
        }
        if(err){
          console.log(err);
          res.send(err);
        }
      })
      if(err){
        console.log(err);
        res.send(err);
      }
    })
  }
 
  getData();
})

module.exports = router;
