var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');

router.post("/endAssessment",jsonParser, (req, res) => {

  const status = req.body.status;
  const canId = req.body.canId;
  const assessmentId = req.body.assessmentId;
  const endTime = req.body.endTime;


  // await sql.open(details.connectionString, async (err, conn)=>{
  //   await  conn.query(`INSERT INTO AssessmentDetails(assessmentId, queId, ansId, score, Note, assessmentDetailsStatus) 
  //   SELECT assessmentId, queId, ansId, score, Note, AssessmentStagingstatus FROM AssessmentStaging WHERE canId=${canId} AND assessmentId=${assessmentId}`,(err, data)=>{
  //       if(data){
  //         conn.query(`UPDATE Assessment SET assessmentstatus= '${status}',endTime=${endTime} WHERE canId=${canId} AND assessmentId=${assessmentId}`,
  //         (err,data)=>{
  //           if(data){
  //             console.log(data);
  //           }
  //           if(err){
  //             console.log(err);
  //           }
  //         });
  //          conn.query(`UPDATE Candidates SET Candidatestatus='${status}' WHERE canId = ${canId}`,
  //         (err, output)=>{
  //           if(err){
  //             console.log(err);
  //           }
  //           if(output){
  //             console.log(output);
  //           }
  //         });
  //         console.log(data);
  //         const result = { 
  //           "status": `The assessment information is stored for candidateId ${canId} and status is set to closed`
  //          };
  //         res.status(200).json(result);
  //       }
  //       if(err){
  //         console.log(err);
  //         res.send(err);
  //       }
  //     })
  //     if(err){
  //       console.log(err);
  //       res.send(err);
  //     }
  //   })

  async function storeDataEndAssessment()
  {
    await ConnectToDb().then(async (dbConnection)=>{
      if(dbConnection){
         await ExecuteQuery(dbConnection, `INSERT INTO AssessmentDetails(assessmentId, queId, ansId, score, Note, assessmentDetailsStatus) 
         SELECT assessmentId, queId, ansId, score, Note, AssessmentStagingstatus FROM AssessmentStaging WHERE canId=${canId} AND assessmentId=${assessmentId}`)

          .then(async (insertedResponseData)=>{
              if(insertedResponseData){
                await ExecuteQuery(dbConnection, `UPDATE Assessment SET assessmentstatus= '${status}',endTime='${endTime}' WHERE canId=${canId} AND assessmentId=${assessmentId}`)

                .then(async (updatedAssessmentData)=>{
                  if(updatedAssessmentData){
                    await ExecuteQuery(dbConnection, `UPDATE Candidates SET Candidatestatus='${status}' WHERE canId = ${canId}`)

                    .then(async (updatedCandidateData)=>{
                      if(updatedCandidateData){
                        const result = { 
                          "status": `The assessment information is stored for candidateId ${canId} and status is set to closed`
                         };
                         
                        res.status(200).json(result);
                      }
                      else{
                        res.status(500).send("Storing of assessment iformation failed!!!");
                      }
                    })
                  }
                  else{
                    console.log("Assessment status not updated!!!");
                  }
                })
              }
              else{
                console.log("AssessmentDetails data is not inserted!!!");
              }
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
      res.status(500).json(err);
      dbConnection.close();
  })
  }
 
  storeDataEndAssessment();
});




module.exports = router;