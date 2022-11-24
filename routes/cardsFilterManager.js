var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const {ConnectToDb,ExecuteQuery} = require('../db');

var arr=[];
router.post("/",jsonParser, (req, res) => {


    const emailId = req.body.emailId;
    const name = req.body.name;
    const status = req.body.status;

    if(emailId){

        async function searchByEmailId(){

            await sql.open(details.connectionString, async (err, conn)=>{
                if(conn){
                    await conn.query(`select canId,canName,canPhone,canExperience,
                    Candidatestatus ,EmailId
                    from Candidates where EmailId='${emailId}' `,async (err,data)=>{
                        if(data){
                            console.log(data);
                            for (let i=0; i<data.length; i++)
                            {
                              var id = data[i].canId;
                              console.log(id);
                              
                              await conn.query(`select Skill.skillName,Complexity.Name,Complexity.skilllevel,Skill.skillId,Complexity.cmpId from CandidateSkills 
                              left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity 
                              on  Complexity.cmpId =CandidateSkills.cmpId where CandidateSkills.canId = ${id}
                              `,async (err,val)=>{
                                if(val){
                                    console.log(val);
                                    console.log(data[i]);
                                    data[i].skills=val;
                                    arr[i]=data[i];
                                    console.log(data[i]);
                                 
                                }
                                if(err){
                                  console.log(err);
                                }
                                })
                            }
                            console.log("array is",arr);
                            setTimeout(()=>{
                                res.status(200).json({arr});
                                conn.close();
                              },1000)
                        }
                    //    await conn.close();
                        if(err){
                            console.log(err);
                            res.send(err);
                            conn.close();
                        }
                    })
                }
                if(err){
                    console.log(err);
                    res.send(err);
                    conn.close();
                }
            })
        }
        searchByEmailId();
    }

    if(name){

        async function searchByName(){

            ConnectToDb().then(async (dbConnection)=>{
                if(dbConnection){
                    ExecuteQuery(dbConnection, `select canId,canName,canPhone,canExperience,
                    Candidatestatus ,EmailId
                    from Candidates where canName = '${name}'`)
                    .then((candidateArrayData)=>{
                        console.log(candidateArrayData);
                        var id;
                        for(let i=0; i<candidateArrayData.length; i++){
                             id = candidateArrayData[i].canId;

                            ExecuteQuery(dbConnection, `select Skill.skillName,Complexity.Name,Complexity.skilllevel,Skill.skillId,Complexity.cmpId from CandidateSkills 
                            left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity 
                            on  Complexity.cmpId =CandidateSkills.cmpId where CandidateSkills.canId = ${id}`)
                            .then((candidateSkills)=>{
                              candidateArrayData[i].skills = candidateSkills;
                            })
                            .catch((err)=>{
                                console.log(err);
                            })
                        }
                        console.log(candidateArrayData);
                        setTimeout(()=>{
                            res.status(200).json({candidateArrayData});
                            dbConnection.close();
                          },1000)
                    })
                    .catch((err)=>{
                        console.log(err);
                        dbConnection.close();
                    })
                }
                else{
                    console.log("Not connected to db");
                }
            }).catch((err)=>{
                console.log(err);
                dbConnection.close();
            })
        }
        searchByName();
    }

    if(status){

        async function searchByStatus(){

            ConnectToDb().then(async (dbConnection)=>{
                if(dbConnection){
                    ExecuteQuery(dbConnection, `select canId,canName,canPhone,canExperience,
                    Candidatestatus ,EmailId
                    from Candidates where Candidatestatus = '${status}'`)
                    .then(async (candidateArrayData)=>{
                       await setSkillsToCandidates(dbConnection, candidateArrayData)
                       .then((a)=>{
                           console.log("skills is", a);
                           res.status(200).json({a});
                       })
                        // console.log(candidateArrayData);
                    })
                    .catch((err)=>{
                        console.log(err);
                        dbConnection.close();
                    })
                }
                else{
                    console.log("Not connected to db");
                }
            }).catch((err)=>{
                console.log(err);
                dbConnection.close();
            })
        }
        searchByStatus();

        async function setSkillsToCandidates(dbConnection, candidateArrayData){
            var id;
            for(let i=0; i<candidateArrayData.length; i++){
                 id = candidateArrayData[i].canId;

               await ExecuteQuery(dbConnection, `select Skill.skillName,Complexity.Name,Complexity.skilllevel,Skill.skillId,Complexity.cmpId from CandidateSkills 
                left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity 
                on  Complexity.cmpId =CandidateSkills.cmpId where CandidateSkills.canId = ${id}`)
                .then((candidateSkills)=>{
                    // console.log(candidateSkills);
                     candidateArrayData[i].skills = candidateSkills;
                     candidateArrayData;
                   //console.log(candidateArrayData[i]);
                })
                .catch((err)=>{
                    console.log(err);
                })
            }
            return candidateArrayData;
        }
    }

});

module.exports = router;