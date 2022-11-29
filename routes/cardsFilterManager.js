var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');

async function setSkillsToCandidates(dbConnection, candidateArrayData){
    var id;
    for(let i=0; i<candidateArrayData.length; i++){
         id = candidateArrayData[i].canId;

       await ExecuteQuery(dbConnection, `select Skill.skillName,Complexity.Name,Complexity.skilllevel,Skill.skillId,Complexity.cmpId from CandidateSkills 
        left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity 
        on  Complexity.cmpId =CandidateSkills.cmpId where CandidateSkills.canId = ${id}`)
        .then((candidateSkills)=>{
            candidateArrayData[i].skills = candidateSkills;
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    return candidateArrayData;
}


router.post("/",jsonParser, (req, res) => {


    const emailId = req.body.emailId;
    console.log(emailId);
    const name = req.body.name;
    const status = req.body.status;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;


        async function searchByEmailId(){

           await ConnectToDb().then(async (dbConnection)=>{
                if(dbConnection){

                    let query = `select canId,canName,canPhone,canExperience,
                    Candidatestatus ,EmailId
                    from Candidates where canId is not null`;

                    if((emailId&&name&&status)===undefined){
                        query = `select canId,canName,canPhone,canExperience,
                        Candidatestatus ,EmailId
                        from Candidates where Candidatestatus='Open'`
                    }
                    if(emailId){
                        query += ` and EmailId like '${emailId}%'`
                    }
                    if(name){
                        query += ` and canName like '%${name}%'`
                    }
                    if(status){
                        query += ` and Candidatestatus='${status}'`
                    }
                    if(startDate&&endDate){
                        query 
                    }
 
                    await ExecuteQuery(dbConnection, query)
                    .then(async (candidateArrayData)=>{
                        console.log(query);
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
        searchByEmailId();

    // if(name){

    //     async function searchByName(){

    //        await ConnectToDb().then(async (dbConnection)=>{
    //             if(dbConnection){
    //                await ExecuteQuery(dbConnection, `select canId,canName,canPhone,canExperience,
    //                 Candidatestatus ,EmailId
    //                 from Candidates where canName like '%${name}%'`)
    //                 .then(async (candidateArrayData)=>{
    //                    await setSkillsToCandidates(dbConnection, candidateArrayData)
    //                    .then((result)=>{
    //                        res.status(200).json({result});
    //                        dbConnection.close();
    //                    })
    //                 })
    //                 .catch((err)=>{
    //                     console.log(err);
    //                     res.status(500).json(err);
    //                     dbConnection.close();
    //                 })
    //             }
    //             else{
    //                 console.log("Not connected to db");
    //             }
    //         }).catch((err)=>{
    //             console.log(err);
    //             res.status(500).json(err);
    //             dbConnection.close();
    //         })
    //     }
    //     searchByName();
    // }

    // if(status){

    //     async function searchByStatus(){

    //        await ConnectToDb().then(async (dbConnection)=>{
    //             if(dbConnection){
    //                await ExecuteQuery(dbConnection, `select canId,canName,canPhone,canExperience,
    //                 Candidatestatus ,EmailId
    //                 from Candidates where Candidatestatus = '${status}'`)
    //                 .then(async (candidateArrayData)=>{
    //                    await setSkillsToCandidates(dbConnection, candidateArrayData)
    //                    .then((result)=>{
    //                        res.status(200).json({result});
    //                        dbConnection.close();
    //                    })
    //                 })
    //                 .catch((err)=>{
    //                     console.log(err);
    //                     res.status(500).json(err);
    //                     dbConnection.close();
    //                 })
    //             }
    //             else{
    //                 console.log("Not connected to db");
    //             }
    //         }).catch((err)=>{
    //             console.log(err);
    //             res.status(500).json(err);
    //             dbConnection.close();
    //         })
    //     }
    //     searchByStatus();

    // }

    // if(startDate&&endDate)
    // {
    //     async function searchByDate(){

    //         await ConnectToDb().then(async (dbConnection)=>{
    //              if(dbConnection){
    //                 await ExecuteQuery(dbConnection, `select Assessment.date, Assessment.assessmentstatus ,Candidates.canId, Candidates.canName, Candidates.EmailId, Candidates.canPhone
    //                 ,Candidates.canExperience,Candidates.Candidatestatus from Assessment left join Candidates on 
    //                 Candidates.canId=Assessment.canId where Assessment.date between '${startDate}' and '${endDate}'`)
    //                  .then(async (candidateArrayData)=>{
    //                     await setSkillsToCandidates(dbConnection, candidateArrayData)
    //                     .then((result)=>{
    //                         res.status(200).json({result});
    //                         dbConnection.close();
    //                     })
    //                  })
    //                  .catch((err)=>{
    //                      console.log(err);
    //                      res.status(500).json(err);
    //                      dbConnection.close();
    //                  })
    //              }
    //              else{
    //                  console.log("Not connected to db");
    //              }
    //          }).catch((err)=>{
    //              console.log(err);
    //              res.status(500).json(err);
    //              dbConnection.close();
    //          })
    //      }
    //      searchByDate();
    // }

});

module.exports = router;