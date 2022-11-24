var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json()


router.post("/saveData", jsonParser, (req, res)=>{
  if(req.body != undefined){
    const emailId = req.body.emailId;
    const name = req.body.name;
    const phone = req.body.phone;
    const experience = req.body.experience;
    const skills = req.body.skills;
    async function getData()
    {
      await sql.open(details.connectionString, async (err, conn)=>{
      await  conn.query( `INSERT INTO Candidates (canName,canPhone,canExperience,EmailId) values( '${name}','${phone}','${experience}','${emailId}')`,(err)=>{
          if(err){
            // console.log(dat);
            // const result = { };
            res.send(err);
          }
          if(conn){
          conn.query(`SELECT canId from Candidates where canName= '${name}' and canPhone= '${phone}'and canExperience='${experience}' and
          EmailId = '${emailId}' `,(err,data)=> {
            if(data){
              const [{canId}]=data
              console.log(canId);
              for(let item of skills)
              {
                // console.log(item)
                conn.query(`INSERT into Candidateskills (cmpId,skillId,canId) values ('${item.cmpId}','${item.skillId}', '${canId}')`,(err)=>{
                  if(err){
                    // console.log(err);
                    res.send(err);
                  }
                  else{
                    var success = {
                      status: "Success",
                      message: `Profile created successfully for ${canId}`
                    }
                    res.status(200).json(success);
                  }
                })
              }
            }
          } );
        }
          // res.send("success");
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
            await conn.query(`select Skill.skillName,Complexity.Skilllevel from CandidateSkills 
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

router.post("/filterEmail", jsonParser, (req, res) => {
  if (req.body != undefined) {
    const emailId = req.body.emailId;
    async function getProfileEmail() {
      const emailquery=`select * from Candidates where EmailId='${emailId}'`
     await sql.query(details.connectionString,emailquery, (data,err)=>{
        if(data){
          const candidate={data};
          res.status(200).json(candidate);
        }
        if(err){
          res.send(err);
        }
     })
    }
    getProfileEmail();
  }
});

router.post("/updateCandidateStatus", jsonParser, (req, res) => {
  const data = req.body.data; //array structure
  const skills = data[0].skills;
  const canId = data[0].canId;
  console.log(canId)
  async function getData() {
    await sql.open(details.connectionString, async (err, conn) => {
      await conn.query(`update Candidates set canExperience=${data[0].canExperience},Candidatestatus='${data[0].Candidatestatus}'`, async (err, data) => {
        if (data) {
          console.log(data);
          for (let i = 0; i < skills.length; i++) {
            await sql.open(details.connectionString, async (err, conn) => {
              await conn.query(`insert into CandidateSkills(cmpId,skillId,canId) values(${skills[i].cmpId},${skills[i].skillId},
                ${canId})`, (err, value) => {
                if (value) {
                  const result = {
                    "status": "success",
                    "Message": "candidate data updated successfully "
                  };
                  console.log(result);
                  res.status(200).json(result);
                }
                if (err) {
                  res.send(err);
                }
              })
              if (err) {
                res.send(err);
              }
            })
          }
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
  getData();
});
  module.exports = router;