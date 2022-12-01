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
            await ExecuteQuery(dbConnection, `insert into CandidateInterview(canId,date,status) values(${canId},'${date}','${status}')`)
            .then(async (result)=>{
              if(result){
                await ExecuteQuery(dbConnection, `select InterviewId from CandidateInterview where canId=${canId} and date='${date}' and status='${status}' `)
                .then((interviewId)=>{
                    if(interviewId){
                        let id = interviewId[0].InterviewId;
                        console.log(result);
                        var statusMessage={
                            InterviewId: id,
                            "status":"success",
                            "message":"inserted into CandidateIterview table!!!"
                        }
                        res.status(200).json(statusMessage);
                        dbConnection.close();
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
        InsertCandidateInterview();  //insert into CandidateInterview
    }
    else{
        console.log("req.body is undefined");
    }
  });

  router.post('/addSkills', jsonParser, (req, res)=>{

    if(req.body != undefined){

        const skills = req.body.skills
        const InterviewId =req.body.InterviewId;

        async function addInterviewSkills()//Insert InterviewSkills
        {
          await ConnectToDb().then(async (dbConnection)=>{
            if(dbConnection){
                await insertIntoInterviewSkills(dbConnection)
                .then((insertedSkillsData)=>{
                    if(insertedSkillsData){

                        var statusMessage={
                           "status":"success",
                           "message":"inserted into IterviewSkills table!!!"
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
              console.log("Not connected to db");
            }
           }).catch((err)=>{
            console.log(err+2);
           })
          }
          addInterviewSkills(); //insert into InterviewSkills

          async function insertIntoInterviewSkills(dbConnection){
            let count=0;
            for(let i=0; i<skills.length; i++)
            {
                await ExecuteQuery(dbConnection, `insert into InterviewSkills(skillId,cmpId,InterviewId) values(${skills[i].skillId},${skills[i].cmpId},${InterviewId})`)
                .then(async (result)=>{
                  if(result){
                    count++;
                    console.log(result);
                  }
                })
                .catch((err)=>{
                  console.log(err+1);
                })
            }
            if(count === skills.length){
                return "skills inserted successfully!!!";
            }
            return null;
          }
      }
      else{
          console.log("req.body is undefined");
      }
  })

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