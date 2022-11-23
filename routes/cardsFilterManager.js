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
    const date = req.body.date;

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
                    .then((candidateData)=>{
                        console.log(candidateData);
                        var id;
                        for(let i=0; i<candidateData.length; i++){
                             id = candidateData[i].canId;

                            ExecuteQuery(dbConnection, `select Skill.skillName,Complexity.Name,Complexity.skilllevel,Skill.skillId,Complexity.cmpId from CandidateSkills 
                            left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity 
                            on  Complexity.cmpId =CandidateSkills.cmpId where CandidateSkills.canId = ${id}`)
                            .then((candidateSkills)=>{
                              candidateData[i].skills = candidateSkills;
                            })
                            .catch((err)=>{
                                console.log(err);
                            })
                        }
                        console.log(candidateData);
                        setTimeout(()=>{
                            res.status(200).json({candidateData});
                          },1000)
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                }
                else{
                    console.log("Not connected to db");
                }
            }).catch((err)=>{
                console.log(err);
            })
        }
        searchByName();
    }

    if(date){}

});

module.exports = router;