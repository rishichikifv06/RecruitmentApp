var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');


router.post("/saveData", jsonParser, (req, res)=>{
  if(req.body != undefined){
    const emailId = req.body.emailId;
    const name = req.body.name;
    const phone = req.body.phone;
    const experience = req.body.experience;
    const skills = req.body.skills;


    async function toCreateCandidateProfile()
    {
      
      await ConnectToDb().then(async (dbConnection)=>{
        if(dbConnection){
           await ExecuteQuery(dbConnection, `INSERT INTO Candidates (canName,canPhone,canExperience,EmailId,Candidatestatus) values( '${name}',${phone},${experience},'${emailId}','New')`)
  
            .then(async (insertedCandidateData)=>{
                if(insertedCandidateData){
                  console.log(insertedCandidateData);
                  await ExecuteQuery(dbConnection, `SELECT canId from Candidates where canName= '${name}' and canPhone= ${phone} and canExperience=${experience} and
                  EmailId = '${emailId}'`)
                  .then(async (candidateData)=>{
                    if(candidateData){
                      const [{canId}]=candidateData;

                      await toInsertSkillsForCandidate(canId,dbConnection)
                      .catch((err)=>{
                        console.log(err);
                        res.send(err);
                        dbConnection.close();
                      })
                      .then(async (insertedSkillsData)=>{
                        if(insertedSkillsData){
                          var success = {
                            status: "Success",
                            message: `Profile created successfully for ${canId}`
                          }
                          res.status(200).json(success);
                          dbConnection.close();
                        }
                        else{
                          res.status(500).send("Profile creation failed!!!");
                          dbConnection.close();
                        }
                      })
                      .catch((err)=>{
                        console.log(err);
                        res.send(err);
                        dbConnection.close();
                      })
                    }
                    else{
                      console.log("Candidates Data not selected!!!");
                      dbConnection.close();
                    }
                  })
  
                }
                else{
                  console.log("Candidates data is not inserted!!!");
                  dbConnection.close();
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
    toCreateCandidateProfile();

    async function toInsertSkillsForCandidate(canId, dbConnection){

      let count=0;
      for(let i=0; i<skills.length; i++){
        await ExecuteQuery(dbConnection, `INSERT into Candidateskills (cmpId,skillId,canId) values (${skills[i].cmpId},${skills[i].skillId}, ${canId})`)
        .then((insertedCandidateSkillsData)=>{
          if(insertedCandidateSkillsData){
            count++;
          }
        })
      }
      if(count>0){
        return "Skills for Candidate is inserted!!!";
      }
      return null;
    }
  }
})


router.post("/candidateSkill", jsonParser, (req, res) => {

  const emailId = req.body.emailId;

  async function getCandidateSkillsandAssessment() {
    await sql.open(details.connectionString, async (err, conn) => {
      await conn.query(`select * from Candidates  where EmailId='${emailId}'`, (err, data) => {
        if (data.length!=0) {
          const canId = data[0].canId;
          console.log(canId);
          sql.open(details.connectionString, async (err, conn) => {
            await conn.query(`select Skill.skillName,Complexity.Skilllevel,CandidateSkills.canskillId from CandidateSkills 
            left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity on Complexity.cmpId=CandidateSkills.cmpId
            where canId=${canId}`, (err, val) => {
              if (val) {
                data[0].skills = val;
                // const record={data};
                // res.status(200).json(record);
              }
              if (err) {
                res.send(err);
              }
            })
          })
          sql.open(details.connectionString, async (err, conn) => {
            await conn.query(`select * from Assessment where canId=${canId}`, (err, details) => {
              if (details) {
                var flag = 0;
                for (let i = 0; i < details.length; i++) {
                  if (details[i].assessmentstatus === 'Open') {
                    flag = 1;
                  }
                }
                if (flag == 0) {
                  data[0].assessmentsStatus = 'closed';
                }
                else {
                  data[0].assessmentsStatus = 'notClosed';
                }
                data[0].assessments = details;
                setTimeout(() => {
                  res.status(200).json({ data });
                  conn.close();
                }, 2000)
              }
              if (err) {
                res.send(err);
              }
            })
          })
        }
        if(data.length == 0){
          const result={
            "status":"not found",
            "message":"no record found"
          }
          setTimeout(()=>{
            res.status(200).json(result);
            conn.close();
          },2000)
        }
        if (err) {
          console.log(err);
          res.send(err);
        }
      })
      if (err) {
        console.log(err);
        res.send(err);
      }
    })
  }
  getCandidateSkillsandAssessment();
});



router.post("/updateCandidateStatus", jsonParser, (req, res) => {
  const data = req.body.data; //array structure
  const skills = data[0].skills;
  const canId = data[0].canId;
  console.log(canId)
  async function updateCandidateData() {
    
    await ConnectToDb().then(async (dbConnection)=>{
      if(dbConnection){
         await ExecuteQuery(dbConnection, `update Candidates set canExperience=${data[0].canExperience},Candidatestatus='${data[0].Candidatestatus}'`)

          .then(async (updatedCandidateData)=>{
              if(updatedCandidateData){
               await toInsertCandidateSkills(dbConnection)

               .then((responseData)=>{
               if(responseData){
                  const result = {
                    "status": "success",
                    "Message": "candidate data and respective skills are updated successfully "
                  };
                  res.status(200).json(result);
                  dbConnection.close();
                }
               })
               .catch((err)=>{
                console.log(err);
                res.status(500).json(err);
                dbConnection.close();
               })
              }
              else{
                console.log("Candidate data not updated!!!");
                dbConnection.close();
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
  updateCandidateData();

  async function toInsertCandidateSkills(dbConnection){

    let count=0;
    for(let i=0; i<skills.length; i++){
      await ExecuteQuery(dbConnection, `insert into CandidateSkills(cmpId,skillId,canId) values(${skills[i].cmpId},${skills[i].skillId},
        ${canId})`)
        .then((insertedCansdidateSkillsData)=>{
          if(insertedCansdidateSkillsData){
            count++;
          }
        })
        .catch((err)=>{
          console.log(err);
        })
      }
      if(count>0){
        return "Candidate skills inserted successfully!!!"
      }
      return null;
  }
});
  module.exports = router;