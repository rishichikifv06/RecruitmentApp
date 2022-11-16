var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.post("/endAssessment",jsonParser, (req, res) => {

  const status = req.body.assessmentDetailsStatus;
  const canId = req.body.canId;
  const assessmentId = req.body.assessmentId;

  async function getData()
  {
    await sql.open(details.connectionString, async (err, conn)=>{
    await  conn.query(`INSERT INTO AssessmentDetails(assessmentId, queId, ansId, score, Note, assessmentDetailsStatus) 
    SELECT assessmentId, queId, ansId, score, Note, AssessmentStagingstatus FROM AssessmentStaging WHERE canId=${canId} AND assessmentId=${assessmentId}`,(err, data)=>{
        if(data){
           conn.query(`UPDATE Candidates SET Candidatestatus='${status}' WHERE canId = ${canId} AND assessmentId = ${assessmentId}`),
          (err, output)=>{
            if(err){
              console.log(err);
            }
            if(output){
              console.log(output);
            }
          }
          console.log(data);
          const result = { 
            "status": `The assessment information is stored for candidateId ${canId} and status is set to closed`
           };
          res.status(200).json(result);
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
});




module.exports = router;