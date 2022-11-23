var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

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
                            const result = {arr}
                            console.log("array is",arr);
                            res.status(200).json(result);
                            // await conn.close();
                        }
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

            await sql.open(details.connectionString, async (err, conn)=>{
                if(conn){
                    await conn.query(`SELECT * FROM Candidates WHERE canName='${name}'`, (err,data)=>{
                        if(data){
                            res.status(200).json({data});
                            conn.close();
                        }
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
                }
            })
        }
        searchByName();
    }

    if(date){

        async function searchByDate(){

            await sql.open(details.connectionString, async (err, conn)=>{
                if(conn){
                    await conn.query(`SELECT * FROM Candidates WHERE canName='${name}'`, (err,data)=>{
                        if(data){
                            res.status(200).json({data});
                            conn.close();
                        }
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
                }
            })
        }
        searchByDate();
    }
});

module.exports = router;