var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');



async function setSkillsToCandidates(dbConnection, candidateArrayData){
  var id;
  for(let i=0; i<candidateArrayData.length; i++){
       id = candidateArrayData[i].canId;

     await ExecuteQuery(dbConnection, `select Skill.skillName,Complexity.Name,Complexity.skilllevel,Skill.skillId,Complexity.cmpId, from CandidateSkills 
      left join Skill on Skill.skillId=CandidateSkills.skillId
      left join Complexity on  Complexity.cmpId =CandidateSkills.cmpId
      where CandidateSkills.canId = ${id}`)
      .then((candidateSkills)=>{
          candidateArrayData[i].skills = candidateSkills;
      })
      .catch((err)=>{
          console.log(err);
      })
  }
  return candidateArrayData;
}

router.get("/", (req, res)=>{



  async function getAllProfiles() { 

   await ConnectToDb().then(async (dbConnection)=>{
      if(dbConnection){
         await ExecuteQuery(dbConnection, `select canId,canName,canPhone,canExperience,
          Candidatestatus ,EmailId
          from Candidates `)
          .then(async (candidateArrayData)=>{
             await setSkillsToCandidates(dbConnection, candidateArrayData)
             .then((result)=>{
                 res.status(200).json({result});
                 dbConnection.close();
             })
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
  getAllProfiles();
})

      


module.exports = router;
