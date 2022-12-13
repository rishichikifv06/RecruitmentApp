var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const { ConnectToDb, ExecuteQuery } = require("../db");

async function setSkillsToCandidates(dbConnection, candidateArrayData) {
  var id;
  for (let i = 0; i < candidateArrayData.length; i++) {
    id = candidateArrayData[i].InterviewId;

    await ExecuteQuery(
      dbConnection,
      `select Skill.skillName,Complexity.Name,Complexity.skilllevel,Skill.skillId,Complexity.cmpId from InterviewSkills 
       left join Skill on Skill.skillId=InterviewSkills.skillId 
       left join Complexity on Complexity.cmpId =InterviewSkills.cmpId 
       where InterviewSkills.InterviewId = ${id}`
    )
      .then((candidateSkills) => {
        candidateArrayData[i].skills = candidateSkills;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return candidateArrayData;
}

router.post("/", jsonParser, (req, res) => {
  const emailId = req.body.emailId;
  console.log(emailId);
  const name = req.body.name;
  const status = req.body.status;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;


  if (startDate && endDate) {

    try {
        
        async function searchByFilter() {
        
            await ConnectToDb()
              .then(async (dbConnection) => {
                if (dbConnection) {
                  let query = `select CandidateInterview.date, CandidateInterview.InterviewId, CandidateInterview.status ,Candidates.canId, Candidates.canName, Candidates.EmailId, Candidates.canPhone
                  ,Candidates.canExperience from CandidateInterview 
                  left join Candidates on Candidates.canId=CandidateInterview.canId 
                  where CandidateInterview.date between '${startDate}' and '${endDate}'`;
                  let whereClause = "noWhere";
        
                  if (
                    emailId === undefined &&
                    name === undefined &&
                    status === undefined &&
                    startDate === undefined &&
                    endDate === undefined
                  ) {
                    query = `select CandidateInterview.date, CandidateInterview.InterviewId, CandidateInterview.status ,Candidates.canId, Candidates.canName, Candidates.EmailId, Candidates.canPhone
                    ,Candidates.canExperience from CandidateInterview 
                    left join Candidates on Candidates.canId=CandidateInterview.canId 
                    where CandidateInterview.status='Open'`;
                  } else {
                    if (emailId) {
                      whereClause += ` AND EmailId like '${emailId}%'`;
                    }
                    if (name) {
                      whereClause += ` AND canName like '%${name}%'`;
                    }
                    if (status) {
                      whereClause += ` AND CandidateInterview.status='${status}'`;
                    }
                    whereClause = whereClause.replace("noWhere", "");
                    query += whereClause;
                  }
        
                  await ExecuteQuery(dbConnection, query)
                    .then(async (candidateArrayData) => {
                      console.log(query);
                      await setSkillsToCandidates(
                        dbConnection,
                        candidateArrayData
                      ).then((result) => {
                        res.status(200).json({ result });
                        dbConnection.close();
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(500).json(err);
                      dbConnection.close();
                    });
                } else {
                  console.log("Not connected to db");
                }
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json(err);
                dbConnection.close();
              });
          }
          searchByFilter();  
    } catch (error) {
        console.log(error);
    }
  

  }
 else{

    try {
        
        async function searchByFilter() {
       
           await ConnectToDb()
             .then(async (dbConnection) => {
               if (dbConnection) {
                 let query = `select CandidateInterview.date, CandidateInterview.InterviewId, CandidateInterview.status ,Candidates.canId, Candidates.canName, Candidates.EmailId, Candidates.canPhone
                 ,Candidates.canExperience from CandidateInterview 
                 left join Candidates on Candidates.canId=CandidateInterview.canId `;
                 let whereClause = "noWhere";
       
                 if (
                   emailId === undefined &&
                   name === undefined &&
                   status === undefined
                 ) {
                   query = `select CandidateInterview.date, CandidateInterview.InterviewId, CandidateInterview.status ,Candidates.canId, Candidates.canName, Candidates.EmailId, Candidates.canPhone
                   ,Candidates.canExperience from CandidateInterview 
                   left join Candidates on Candidates.canId=CandidateInterview.canId 
                   where CandidateInterview.status='Open'`;
                 } else {
                   if (emailId) {
                     whereClause += ` AND EmailId like '${emailId}%'`;
                   }
                   if (name) {
                     whereClause += ` AND canName like '%${name}%'`;
                   }
                   if (status) {
                     whereClause += ` AND CandidateInterview.status='${status}'`;
                   }
                   whereClause = whereClause.replace("noWhere AND", "where");
                   query += whereClause;
                 }
       
                 await ExecuteQuery(dbConnection, query)
                   .then(async (candidateArrayData) => {
                     console.log(query);
                     await setSkillsToCandidates(
                       dbConnection,
                       candidateArrayData
                     ).then((result) => {
                       res.status(200).json({ result });
                       dbConnection.close();
                     });
                   })
                   .catch((err) => {
                     console.log(err);
                     res.status(500).json(err);
                     dbConnection.close();
                   });
               } else {
                 console.log("Not connected to db");
               }
             })
             .catch((err) => {
               console.log(err);
               res.status(500).json(err);
               dbConnection.close();
             });
         }
         searchByFilter();
    } catch (error) {
        console.log(error);
    }

 }
      
    });


module.exports = router;
