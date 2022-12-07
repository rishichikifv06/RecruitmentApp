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
      const interviewSkills =req.body.interviewSkills
      
      async function InsertCandidateInterview()//Insert CandidateInterview
      {
        await ConnectToDb().then(async (dbConnection)=>{
          if(dbConnection){
            await ExecuteQuery(dbConnection, `insert into CandidateInterview(canId,date,status) values(${canId},'${date}','Open')`)
            .then(async (result)=>{
              if(result){
                console.log("interview record inserted")
                await ExecuteQuery(dbConnection, `select InterviewId from CandidateInterview where canId=${canId} and date='${date}' and status='Open' `)
                .then(async(interviewId)=>{
                    if(interviewId){
                        let id = interviewId[0].InterviewId;
                        console.log(id ,"interview id");
                        await insertIntoInterviewSkills(dbConnection , interviewSkills,id)
                        .then((insertedSkillsData)=>{
                          if(insertedSkillsData){
                            console.log("interview skills function call");
                              var statusMessage={
                                 "status":"success",
                                 "message":`Interview is scheduled for Candidate ${canId} on ${date}!!!`
                             }
                             res.status(200).json(statusMessage);
                             dbConnection.close();
                          }
                          else{
                              var statusMessage={
                                  "status":"Failed",
                                  "message":"Not inserted into IterviewSkills table!!!"
                              }
                              res.status(200).json(statusMessage);
                              dbConnection.close();
                          }
                      })
                    }
                    else{
                        var statusMessage={
                            "status":"Failed",
                            "message":"Not inserted into CandidateInterview table!!!"
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
        async function insertIntoInterviewSkills(dbConnection , skills, InterviewId){
          let count=0;
          for(let i=0; i<skills.length; i++)
          {
              await ExecuteQuery(dbConnection, `insert into InterviewSkills(skillId,cmpId,InterviewId) values(${skills[i].skillId},${skills[i].cmpId},${InterviewId})`)
              .then( (result)=>{
                if(result){
                  count++;
                  console.log(result, "inserted into interview skills");
                }
              })
              .catch((err)=>{
                console.log(err+1);
              })
          }
          if(count === skills.length){
            console.log("interview skills function defination");
              return "skills inserted successfully!!!";
          }
          return null;
        }
        InsertCandidateInterview();  //insert into CandidateInterview
    }
    else{
        console.log("req.body is undefined");
    }
  });

  router.post('/getInterviewSkills', jsonParser, (req, res)=>{

    const InterviewId = req.body.InterviewId;

    async function getInterviewSkills()
    {
      await ConnectToDb().then(async (dbConnection)=>{
        if(dbConnection){
            await ExecuteQuery(dbConnection, `select Skill.skillName,Skill.skillId, Complexity.SkillLevel, Complexity.cmpId from InterviewSkills
            left join Skill on Skill.skillId=InterviewSkills.skillId
            left join Complexity on Complexity.cmpId=InterviewSkills.cmpId 
            where InterviewId=${InterviewId}`)
            .then((InterviewSkillsData)=>{
                if(InterviewSkillsData)
                {
                    res.status(200).json({InterviewSkillsData});
                    dbConnection.close();
                }
                else{
                    var statusMessage={
                        "status":"Failed",
                        "message":"Could not fetch Inerview Skills !!!"
                    }
                    res.status(200).json(statusMessage);
                    dbConnection.close();
                }
            })
            .catch((err)=>{
                console.log(err);
                res.status(500).send(err);
            })

        }
        else{
          console.log("Not connected to db");
        }
       }).catch((err)=>{
        console.log(err+2);
       })
      }
      getInterviewSkills(); 
  } )




  module.exports=router;