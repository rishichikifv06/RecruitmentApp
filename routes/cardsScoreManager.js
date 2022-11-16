var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var app = express();
//const { Connection, Request } = require("tedious");
var jsonParser = bodyParser.json();
router.post('/allscore',jsonParser,(req,res)=>
{
    if(req.body!=undefined){
        // const canId=req.body.canId;
        // const Date=req.body.Date;
        const assessmentId=req.body.assessmentId;
        //const Assessmentstatus=req.body.Assessmentstatus;
        async function getScore(){
           await  sql.open(details.connectionString,async(err,conn)=>{
                await conn.query(`select AssessmentDetails.queId,AssessmentDetails.score,Questions.skillId from AssessmentDetails 
                left join Questions on Questions.queId=AssessmentDetails.queId  where assessmentId=${assessmentId} `,(err,val)=>{
                    if(val){
                        const array={
                            val
                        }
                        res.status(200).json(array);
                    }
                    if(err){
                        res.send(err);
                    }
                })
                if(err)
                {
                    res.send(err);
                }
            })
        }
        getScore();
    }
})
module.exports = router;