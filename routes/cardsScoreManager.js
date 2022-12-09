var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');


module.exports.getScore = async(canId,Date,res)=> {

    // await sql.open(details.connectionString, async (err, conn) => {
    //     await conn.query(`select assessmentId from Assessment where canId=${canId} and date='${Date}'`, async (err, data) => {
    //         if (data) {
    //             const assessmentId = data[0].assessmentId;
    //             await conn.query(`
    //             select Skill.skillName, Sum(AssessmentDetails.score) as "candidateScore",count(Questions.skillId)as 
    //             "count" from AssessmentDetails left join Questions
    //             on Questions.queId=AssessmentDetails.queId 
    //             LEFT JOIN Skill ON Questions.skillId=Skill.skillId LEFT JOIN Complexity ON Questions.cmpId=Complexity.cmpId where assessmentId=${assessmentId} 
    //             group by Skill.skillName
    //             `,(err, val) => {
    //                 if (val) {
    //                     val.forEach(element => {
    //                         element.skillScore = element.count*10;
    //                         element.percentage = Math.round(element.candidateScore/element.skillScore*100);
    //                     });
    //                     console.log(val);
    //                     let totalCount = 0;
    //                     let totalScore = 0;
    //                     let totalPercentage = 1;
    //                     let totalCandidateScore = 0;
    //                     val.forEach(element => {
    //                         totalCount = totalCount+element.count;
    //                         totalScore = totalScore+element.skillScore;
    //                         totalCandidateScore = totalCandidateScore+element.candidateScore;  
    //                     })
    //                     totalPercentage = Math.round(totalCandidateScore/totalScore*100);

    //                     let data = {
    //                         val,
    //                         totalCount: totalCount,
    //                         totalScore: totalScore,
    //                         totalCandidateScore: totalCandidateScore,
    //                         totalPercentage: totalPercentage
    //                     }
                        


    //                     res.status(200).json(data);
    //                 }
    //                 if (err) {
    //                     console.log(err);
    //                     res.send(err);
    //                 }
    //             })
    //         }
    //         if (err) {
    //             console.log(err);
    //             res.send(err);
    //         }
    //     })
    //     if (err) {
    //         console.log(err);
    //         res.send(err);
    //     }
    // })

    await ConnectToDb()
    .then(async (dbConnection)=>{
        if(dbConnection){
            await ExecuteQuery(dbConnection, `select assessmentId from Assessment where canId=${canId} and date='${Date}'`)
            .then(async (assessmentIdData)=>{
                let assessmentId = assessmentIdData[0].assessmentId;
                await ExecuteQuery(dbConnection, `select Skill.skillName, Sum(AssessmentDetails.score) as "candidateScore",count(Questions.skillId)as 
                "count" from AssessmentDetails left join Questions
                on Questions.queId=AssessmentDetails.queId 
                LEFT JOIN Skill ON Questions.skillId=Skill.skillId LEFT JOIN Complexity ON Questions.cmpId=Complexity.cmpId where assessmentId=${assessmentId} 
                group by Skill.skillName`)
                .then((skillData)=>{
                    skillData.forEach(element => {
                        element.skillScore = element.count*10;
                        element.percentage = Math.round(element.candidateScore/element.skillScore*100);
                    });

                        let totalCount = 0;
                        let totalScore = 0;
                        let totalPercentage = 1;
                        let totalCandidateScore = 0;
                        skillData.forEach(element => {
                            totalCount = totalCount+element.count;
                            totalScore = totalScore+element.skillScore;
                            totalCandidateScore = totalCandidateScore+element.candidateScore;  
                        })
                        totalPercentage = Math.round(totalCandidateScore/totalScore*100);

                        let data = {
                            skillData,
                            totalCount: totalCount,
                            totalScore: totalScore,
                            totalCandidateScore: totalCandidateScore,
                            totalPercentage: totalPercentage
                        }

                        res.status(200).json(data);
                        dbConnection.close();
                })
                .catch((err)=>{
                    console.log(err);
                    res.status(500).json(err);
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
    })
}


router.post('/scores', jsonParser,(req, res)=>{
    if (req.body != undefined) {
                const canId = req.body.canId;
                const Date = req.body.Date;


               this.getScore(canId,Date,res);

            }
})
module.exports = router;