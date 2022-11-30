var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');
router.post("/addInterview", jsonParser, (req, res)=>{
    if(req.body != undefined){
      const canId = req.body.canId;
      const date =req.body.date;
      const status =req.body.status;
      async function InsertCandidateInterview()//Insert CandidateInterview
      {
        await ConnectToDb().then(async (dbConnection)=>{
          if(dbConnection){
            await ExecuteQuery(dbConnection, `insert into candidateInterview(canId,date,status) values(${canId},'${date}','${status}')`)
            .then(async (result)=>{
              if(result){
                await ExecuteQuery(dbConnection, `select InterviewId from candidateInterview where canId=${canId}, date='${date}', status=${status} `)
                .then((interviewId)=>{
                    if(interviewId){
                        let id = interviewId;
                        console.log(result);
                        var statusMessage={
                            interviewId: id,
                            "status":"success",
                            "message":"inserted into candidateIterview table"
                        }
                        res.status(200).json(statusMessage);
                        dbConnection.close();
                    }
                })
              }
            })
            .catch((err)=>{
              console.log(err+1);
              res.status(500).json(err);
              dbConnection.close();
            })
          }
          else{
            console.log("Not connected to db");
          }
         }).catch((err)=>{
          console.log(err+2);
         })
        }
        InsertCandidateInterview();  //insert into CandidateInterview
    }
    else{
        console.log("req.body is undefined");
    }
  });

  router.post('/insert', jsonParser, (req, res)=>{
    if(req.body != undefined){
        const canId = req.body.canId;
        const date =req.body.date;
        const status =req.body.status;
        async function InsertCandidateInterview()//Insert CandidateInterview
        {
          await ConnectToDb().then(async (dbConnection)=>{
            if(dbConnection){
              await ExecuteQuery(dbConnection, `insert into candidateInterview(canId,date,status) values(${canId},'${date}','${status}')`)
              .then(async (result)=>{
                if(result){
                  console.log(result);
                  var statusMessage={
                      "status":"success",
                      "message":"inserted into candidateIterview table"
                  }
                  res.status(200).json(statusMessage);
                  dbConnection.close();
                }
              })
              .catch((err)=>{
                console.log(err+1);
                res.status(500).json(err);
                dbConnection.close();
              })
            }
            else{
              console.log("Not connected to db");
            }
           }).catch((err)=>{
            console.log(err+2);
           })
          }
          InsertCandidateInterview();  //insert into CandidateInterview
      }
      else{
          console.log("req.body is undefined");
      }
  })
  module.exports=router;