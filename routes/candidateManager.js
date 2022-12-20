var express = require("express");
var router = express.Router();
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
                        dbConnection.release();
                      })
                      .then(async (insertedSkillsData)=>{
                        if(insertedSkillsData){
                          var success = {
                            StatusCode: 200,
                            StatusType: "Success",
                            StatusMessage: `Profile created successfully for ${canId}`,
                            StatusSeverity: "Information updated"
                          }
                          res.status(200).json(success);
                          dbConnection.release();
                        }
                        else{
                          res.status(500).send("Profile creation failed!!!");
                          dbConnection.release();
                        }
                      })
                      .catch((err)=>{
                        console.log(err);
                        res.send(err);
                        dbConnection.release();
                      })
                    }
                    else{
                      console.log("Candidates Data not selected!!!");
                      dbConnection.release();
                    }
                  })
  
                }
                else{
                  console.log("Candidates data is not inserted!!!");
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
        res.status(500).json(err);
        dbConnection.release();
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


// await sql.open(details.connectionString, async (err, conn) => {
//   await conn.query(`select * from Candidates  where EmailId='${emailId}'`, (err, data) => {
//     if (data.length!=0) {
//       const canId = data[0].canId;
//       console.log(canId);
//       sql.open(details.connectionString, async (err, conn) => {
//         await conn.query(`select Skill.skillName,Complexity.Skilllevel,CandidateSkills.canskillId from CandidateSkills 
//         left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity on Complexity.cmpId=CandidateSkills.cmpId
//         where canId=${canId}`, (err, val) => {
//           if (val) {
//             data[0].skills = val;
//             // const record={data};
//             // res.status(200).json(record);
//           }
//           if (err) {
//             res.send(err);
//           }
//         })
//       })
//       sql.open(details.connectionString, async (err, conn) => {
//         await conn.query(`select * from Assessment where canId=${canId}`, (err, details) => {
//           if (details) {
//             var flag = 0;
//             for (let i = 0; i < details.length; i++) {
//               if (details[i].assessmentstatus === 'Open') {
//                 flag = 1;
//               }
//             }
//             if (flag == 0) {
//               data[0].assessmentsStatus = 'released';
//             }
//             else {
//               data[0].assessmentsStatus = 'notreleased';
//             }
//             data[0].assessments = details;
//             setTimeout(() => {
//               res.status(200).json({ data });
//               conn.release();
//             }, 2000)
//           }
//           if (err) {
//             res.send(err);
//           }
//         })
//       })
//     }
//     if(data.length == 0){
//       const result={
//         "status":"not found",
//         "message":"no record found"
//       }
//       setTimeout(()=>{
//         res.status(200).json(result);
//         conn.release();
//       },2000)
//     }
//     if (err) {
//       console.log(err);
//       res.send(err);
//     }
//   })
//   if (err) {
//     console.log(err);
//     res.send(err);
//   }
// })

router.post("/candidateSkill", jsonParser, (req, res) => {

  const emailId = req.body.emailId;

  async function getCandidateSkillsandAssessment() {
    
    await ConnectToDb().then(async (dbConnection)=>{
      await ExecuteQuery(dbConnection, `select * from Candidates  where EmailId='${emailId}'`)
      .then( async (candidatesData)=>{
        console.log(candidatesData);
        if(candidatesData.length!=0){
          const canId = candidatesData[0].canId;
          console.log("candidateId ",canId);

          await ExecuteQuery(dbConnection, `select Skill.skillName,Complexity.Skilllevel,CandidateSkills.canskillId from CandidateSkills 
          left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity on Complexity.cmpId=CandidateSkills.cmpId
          where canId=${canId}`)

          .then(async (skillData)=>{
            candidatesData[0].skills = skillData;

            await ExecuteQuery(dbConnection, `select * from Assessment where canId=${canId}`)
            .then(async (assessmentData)=>{
              
              var flag =0;
              for (let i = 0; i < assessmentData.length; i++) {
                if (assessmentData[i].assessmentstatus === 'Open') {
                  flag = 1;
                }
              }
              if (flag == 0) {
                candidatesData[0].assessmentsStatus = 'Open';
              }
              else {
                candidatesData[0].assessmentsStatus = 'notOpen';
              }
              candidatesData[0].assessments = details;
            })
            .then(()=>{
              res.status(200).json({
                Status: {
                  StatusCode: 200,
  
                  StatusType: "Success",
  
                  StatusMessage: "Record Found",
  
                  StatusSeverity: "Information",
                },candidatesData})
            })
            .catch((err)=>{
              console.log(err);
              dbConnection.release();
              res.status(500).json({err});
            })
          })
          .catch((err)=>{
            console.log(err);
            dbConnection.release();
            res.status(500).json({err});
          })

        }
        else if(candidatesData.length == 0){
          res.status(404).json({
            Status: {
              StatusCode: 404,

              StatusType: "Failed",

              StatusMessage: "No Record Found",

              StatusSeverity: "Information not Found",
            }})
        }
      })
      .catch((err)=>{
        console.log(err);
        dbConnection.release();
        res.status(500).json({err});
      })
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({err});
    })
  }
  getCandidateSkillsandAssessment();
});


router.post("/updateCandidateStatus", jsonParser, (req, res) => {
  const data = req.body.data; //array structure
  const skills = data[0].skills;
  const canId = data[0].canId;
  console.log(canId);
  async function updateCandidateData() {
    await ConnectToDb().then(async (dbConnection) => {
      if (dbConnection) {
        await ExecuteQuery(dbConnection, `update Candidates set canExperience=${data[0].canExperience},Candidatestatus='${data[0].Candidatestatus}'`)
          .then(async (updatedCandidateData) => {
            if (updatedCandidateData) {
              await toInsertCandidateSkills(dbConnection)
                .then((responseData) => {
                  if (responseData) {
                    const result = {
                                  StatusCode: 200,
                                  StatusType: "success",
                                  StatusMessage: "candidate data updated successfully ",
                                  StatusSeverity: "Information updated"
                                }
                    res.status(200).json(result);
                    dbConnection.release();
                  }
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json(err);
                  dbConnection.release();
                })
            }
            else {
              console.log("Candidate data not updated!!!");
              dbConnection.release();
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
            dbConnection.release();
          })
      }
      else {
        console.log("Not connected to db");
      }
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
      dbConnection.release();
    })
  }
  updateCandidateData();
  async function toInsertCandidateSkills(dbConnection) {
    let count = 0;
    for (let i = 0; i < skills.length; i++) {
      if (skills[i].canskillId) {
        await ExecuteQuery(dbConnection, `update CandidatSkills set cmpId=${skills[i].cmpId} where canskillId = ${skills[i].canskillId}`)
          .then((value) => {
            if (value.length == 1) {
              console.log("updating candidate skills is done !!!")
              count++;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      }
      else {
        await ExecuteQuery(dbConnection, `insert into CandidateSkills(cmpId,skillId,canId) values(${skills[i].cmpId},${skills[i].skillId},
          ${canId})`)
          .then((insertedCansdidateSkillsData) => {
            if (insertedCansdidateSkillsData.length == 1) {
              console.log("inserting candidate skills is done !!!")
              count++;
            }
          })
          .catch((err) => {
            console.log(err);
          })
      }
    }
    if(count==skills.length){
      return skills;
    }
    else return null;
  }
});



// router.post("/updateCandidateStatus", jsonParser, (req, res) => {
//   const data = req.body.data; //array structure
//   const skills = data[0].skills;
//   const canId = data[0].canId;
//   let flag =1;
//   console.log(canId)
//   async function getData() {
//     await sql.open(details.connectionString, async (err, conn) => {
//       await conn.query(`update Candidates set canExperience=${data[0].canExperience},Candidatestatus='${data[0].Candidatestatus}'
//       where canId=${canId}`, async (err, data) => {
//         if (data) {
//           console.log("updating candidate data !!!");
//           for (let i = 0; i < skills.length; i++) {
//             await sql.open(details.connectionString, async (err, conn) => {
//               if(skills[i].canskillId){
//                 await conn.query(`update CandidatSkills set cmpId=${skills[i].cmpId} where canskillId = ${skills[i].canskillId}`,(err,value)=>{
//                   if(value){
//                     console.log("updating candidate skills is done !!!")

//                     flag =0;
//                   }
//                   if(err){
//                     console.log(err);
//                   }
//                 })
//               }
//               else{
//                 await conn.query(`insert into CandidateSkills(cmpId,skillId,canId) values(${skills[i].cmpId},${skills[i].skillId},
//                   ${canId})`, (err, value) => {
//                   if (value) {
//                     console.log("inserting candidate skills is done !!!")
//                    flag=0;
//                   }
//                   if (err) {
//                     flag=1;
//                     res.send(err);
//                   }
//                 })
//               }
//               if (err) {
//                 res.send(err);
//               }
//             })
//           }
//          if(flag == 0)
//          {
//           const result = {
//             StatusCode: 200,
//             StatusType: "success",
//             StatusMessage: "candidate data updated successfully ",
//             StatusSeverity: "Information updated"
//           };
//           console.log(result);
//           res.status(200).json(result);
//          }
//         }
//         if (err) {
//           console.log(err);
//           res.send(err);
//         }
//       })
//       if (err) {
//         console.log(err);
//         res.send(err);
//       }
//     })
//   }
//   getData();
// });

//get candidate skills by candidate id

router.post("/displayCandidateSkills", jsonParser, (req, res) => {
  if (req.body != undefined) {
    const canId = req.body.canId;
    async function getcandidateSkills() {
     await ConnectToDb().then( async (dbConnection)=>{
      if(dbConnection){
        await ExecuteQuery(dbConnection,`select CandidateSkills.skillId,CandidateSkills.cmpId,Skill.skillName,Complexity.Name from CandidateSkills
        left join Skill on Skill.skillId=CandidateSkills.skillId
        left join Complexity on Complexity.cmpId = CandidateSkills.cmpId  where canId=${canId}`)
        .then((data)=>{
          if(data){
            res.status(200).json({data});
            dbConnection.release();
          }
        })
        .catch((err)=>{
          console.log(err+1);
          res.status(500).json(err);
          dbConnection.release();
        })
      }
     })
    }
    getcandidateSkills();
  }
  else{
    console.log("body is undefined");
  }
});
  module.exports = router;