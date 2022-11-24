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
    const name = req.body.name;
    const status = req.body.status;

    if(emailId){

        async function searchByEmailId(){

           await ConnectToDb().then(async (dbConnection)=>{
                if(dbConnection){
                   await ExecuteQuery(dbConnection, `select canId,canName,canPhone,canExperience,
                    Candidatestatus ,EmailId
                    from Candidates where EmailId = '${emailId}'`)
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
        searchByEmailId();
    }

    if(name){

        async function searchByName(){

           await ConnectToDb().then(async (dbConnection)=>{
                if(dbConnection){
                   await ExecuteQuery(dbConnection, `select canId,canName,canPhone,canExperience,
                    Candidatestatus ,EmailId
                    from Candidates where canName = '${name}'`)
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
        searchByName();
    }

    if(status){

        async function searchByStatus(){

           await ConnectToDb().then(async (dbConnection)=>{
                if(dbConnection){
                   await ExecuteQuery(dbConnection, `select canId,canName,canPhone,canExperience,
                    Candidatestatus ,EmailId
                    from Candidates where Candidatestatus = '${status}'`)
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
        searchByStatus();

    }

});

module.exports = router;