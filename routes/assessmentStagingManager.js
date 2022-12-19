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
   var assessmentId = req.body.assessmentId;

  async function getSingleQandAFromStaging()
  {
    await ConnectToDb().then(async (dbConnection)=>{
      if(dbConnection){
        var count = await getTotalCount(dbConnection);
        await ExecuteQuery(dbConnection, `SELECT Questions.Question, Answer.Answer, Answer.Answerkeywords, AssessmentStaging.RowandQuestion_number,Skill.skillName,Complexity.Name , AssessmentStaging.AssessmentStagingstatus ,AssessmentStaging.score, AssessmentStaging.Note
        FROM AssessmentStaging
        LEFT JOIN Questions ON Questions.queId=AssessmentStaging.queId LEFT JOIN Skill ON Questions.skillId=Skill.skillId 
        LEFT JOIN Complexity ON Questions.cmpId=Complexity.cmpId
        LEFT JOIN Answer ON Answer.ansId=AssessmentStaging.ansId
        WHERE canId=${canId} and assessmentId=${assessmentId} and RowandQuestion_number=${RowandQuestion_number}`)
        .then(async (result)=>{
          
          if(result){
            console.log(result);
            result[0].currentRecordId = RowandQuestion_number;
            result[0].firsRecordId = 1;
            result[0].nextRecordId = RowandQuestion_number+1;
            result[0].previosRecordId = RowandQuestion_number-1;
            result[0].lastRecordId = count;
            res.status(200).json({
              Status: {
                StatusCode: 200,

                StatusType: "Success",

                StatusMessage: "Record Found",

                StatusSeverity: "Information",
              },result});
            dbConnection.release();
          }
        })
        .catch((err)=>{
          console.log(err);
          res.status(500).json(err);
          dbConnection.release();
        })
      }
      else{
        console.log("Not connected to db");
      }
     }).catch((err)=>{
      console.log(err);
      dbConnection.release();
     })
  }
 
  getSingleQandAFromStaging();

  async function getTotalCount(dbConnection){

    var count = 0;

    await ExecuteQuery(dbConnection, `select count(AssessmentStaging.RowandQuestion_number) as Qcount from AssessmentStaging where assessmentId=${assessmentId}`)
    .then((countOfQA)=>{
      if(countOfQA){
        count = countOfQA[0].Qcount;
      }
      else{
        console.log("count value not acquired!!");
      }
    })

    if(count>0){
      return count;
    }
    return null;
  }
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
            StatusCode: 200,
            StatusType: "Success",
            StatusMessage: `The response is saved successfully for candidateId ${canId} and question number ${RowandQuestion_number}`,
            StatusSeverity: "Information updated"
          }

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
