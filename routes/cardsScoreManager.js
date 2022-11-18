var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require('body-parser');
const { json } = require("body-parser");
const cookieParser = require("cookie-parser");
var app = express();
//const { Connection, Request } = require("tedious");
var jsonParser = bodyParser.json();
router.post('/scores', jsonParser, (req, res) => {
    if (req.body != undefined) {
        const canId = req.body.canId;
        const Date = req.body.Date;
        //const assessmentId=req.body.assessmentId;
        //const Assessmentstatus=req.body.Assessmentstatus;
        async function getScore() {
            await sql.open(details.connectionString, async (err, conn) => {
                await conn.query(`select assessmentId from Assessment where canId=${canId} and date='${Date}'`, async (err, data) => {
                    if (data) {
                        const assessmentId = data[0].assessmentId;
                        await conn.query(`
                        select Questions.skillId,Questions.cmpId ,Skill.skillName, Complexity.Name, Sum(AssessmentDetails.score) as "Totalscore",count(Questions.skillId)as 
                        "count" from AssessmentDetails left join Questions
                        on Questions.queId=AssessmentDetails.queId 
                        LEFT JOIN Skill ON Questions.skillId=Skill.skillId LEFT JOIN Complexity ON Questions.cmpId=Complexity.cmpId where assessmentId=${assessmentId} 
                        group by Questions.skillId,Questions.cmpId,Skill.skillName,Complexity.Name
                        `,(err, val) => {
                            if (val) {
                                const array = {
                                    val
                                }
                                res.status(200).json(array);
                            }
                            if (err) {
                                console.log(err);
                                res.send(err);
                            }
                        })
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
        getScore();
    }
})
module.exports = router;