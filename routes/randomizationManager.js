var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const { ConnectToDb, ExecuteQuery } = require('../db');
function getrandomId(number) {
    return Math.round(Math.random() * number)
}
function toClear(array) {
    for (let z = 0; z < array.length; z++) {
        array.pop();
    }
}
var q = [];
router.post("/", jsonParser, (req, res) => {
    
    if (req.body != undefined) {

        const canId = req.body.canId;
        const recId = req.body.recId;
        const Date = req.body.Date;
        const starttime = req.body.starttime;
        const skills = req.body.skills;
        const InterviewId = req.body.InterviewId;
        const status = req.body.status;

        console.log(skills);
        var count = skills.length
        console.log(count + " skill length");
        var tque = 20;
        var ansId;
        var assessmentId;
        var k = 0;

        InsertIntoAssessment();
        async function InsertIntoAssessment() {
            await ConnectToDb().then(async (dbConnection) => {
                if (dbConnection) {
                    await ExecuteQuery(dbConnection, `insert into Assessment(canId,date,startTime,assessmentstatus,recId,InterviewID) 
                    values(${canId},'${Date}','${starttime}','Open',${recId},${InterviewId})`)
                        .then(async (data) => {
                            console.log(data + " inserted assessment");
                            await ExecuteQuery(dbConnection, `update CandidateInterview set status = '${status}' where InterviewId = ${InterviewId} and canId=${canId}`)
                            .then(async (updatedCandidateInterviewData)=>{
                                if(updatedCandidateInterviewData){

                                    await getAssessmentId(dbConnection);
                                }
                            })
                        })
                        .catch((err) => {
                            console.log(err + 1);
                        })
                }
                else {
                    console.log("not connected to db");
                }
            })
                .catch((err) => {
                    console.log(err + 2);
                    dbConnection.close();
                })
        }
        async function getAssessmentId(dbConnection) {
            if (dbConnection) {
                await ExecuteQuery(dbConnection, `select assessmentId from Assessment where canId=${canId} and date='${Date}' AND assessmentstatus='Open'`)
                    .then(async (assessmentDetails) => {
                        if (assessmentDetails.length != 0) {
                            assessmentId = assessmentDetails[0].assessmentId;
                            console.log(assessmentId + "-  assId");
                            await getQuestionCount(dbConnection, assessmentId);
                        }
                    })
                    .catch((err) => {
                        console.log(err + 3);
                    })
            }
        }
        async function getQuestionCount(dbConnection, assessmentId) {
            if (count == 5) {
                for (let i = 0; i < count; i++) {
                    if (skills[i].cmpId == 3 || skills[i].cmpId == 2 || skills[i].cmpId == 1) {
                        var qcount = Math.round(20 / 100 * tque);
                        foreachQuestionCount(qcount, skills[i].skillId, skills[i].cmpId, dbConnection, assessmentId);
                    }
                }
            }
            if (count == 4) {
                for (let i = 0; i < count; i++) {
                    if (skills[i].cmpId == 3 || skills[i].cmpId == 2 || skills[i].cmpId == 1) {
                        var qcount = Math.round(25 / 100 * tque);
                        foreachQuestionCount(qcount, skills[i].skillId, skills[i].cmpId, dbConnection, assessmentId);
                    }
                }
            }
            if (count == 3) {
                for (let i = 0; i < count; i++) {
                    if (skills[i].cmpId == 3) {
                        var qcount = Math.round(50 / 100 * tque);
                        var easy = Math.round(20 / 100 * qcount);
                        foreachQuestionCount(easy, skills[i].skillId, 1, dbConnection, assessmentId);
                        var intermediate = Math.round(30 / 100 * qcount);
                        foreachQuestionCount(intermediate, skills[i].skillId, 2, dbConnection, assessmentId)
                        var hard = Math.round(50 / 100 * qcount);
                        foreachQuestionCount(hard, skills[i].skillId, 3, dbConnection, assessmentId)
                    }
                    if (skills[i].cmpId == 2) {
                        var qcount = Math.round(30 / 100 * tque);
                        var easy = Math.round(30 / 100 * qcount);
                        foreachQuestionCount(easy, skills[i].skillId, 1, dbConnection, assessmentId);
                        var intermediate = Math.round(70 / 100 * qcount);
                        foreachQuestionCount(intermediate, skills[i].skillId, 2, dbConnection, assessmentId)
                    }
                    if (skills[i].cmpId == 1) {
                        var qcount = Math.round(20 / 100 * tque);
                        var easy = Math.round(70 / 100 * qcount);
                        foreachQuestionCount(easy, skills[i].skillId, 1, dbConnection, assessmentId);
                        var intermediate = Math.round(30 / 100 * qcount);
                        foreachQuestionCount(intermediate, skills[i].skillId, 2, dbConnection, assessmentId);
                    }
                }
            }
            if (count == 2) {
                for (var i = 0; i < count; i++) {
                    if (skills[i].cmpId == 3) {
                        var qcount = Math.round(50 / 100 * tque);
                        var easy = Math.round(20 / 100 * qcount);
                        foreachQuestionCount(easy, skills[i].skillId, 1, dbConnection, assessmentId);
                        var intermediate = Math.round(30 / 100 * qcount);
                        foreachQuestionCount(intermediate, skills[i].skillId, 2, dbConnection, assessmentId)
                        var hard = Math.round(50 / 100 * qcount);
                        foreachQuestionCount(hard, skills[i].skillId, 3, dbConnection, assessmentId)
                    }
                    if (skills[i].cmpId == 2) {
                        var qcount = Math.round(50 / 100 * tque);
                        var easy = Math.round(50 / 100 * qcount);
                        foreachQuestionCount(easy, skills[i].skillId, 1, dbConnection, assessmentId);
                        var intermediate = Math.round(30 / 100 * qcount);
                        foreachQuestionCount(intermediate, skills[i].skillId, 2, dbConnection, assessmentId);
                        var hard = Math.round(20 / 100 * qcount);
                        foreachQuestionCount(hard, skills[i].skillId, 3, dbConnection, assessmentId)
                    }
                    if (skills[i].cmpId == 1) {
                        var qcount = Math.round(50 / 100 * tque);
                        var easy = Math.round(70 / 100 * qcount);
                        foreachQuestionCount(easy, skills[i].skillId, 1, dbConnection, assessmentId);
                        var intermediate = Math.round(30 / 100 * qcount);
                        foreachQuestionCount(intermediate, skills[i].skillId, 2, dbConnection, assessmentId);
                    }
                }
            }
            if (count == 1) {
                for (let i = 0; i < count; i++) {
                    if (skills[i].cmpId == 3) {
                        var qcount = Math.round(100 / 100 * tque);
                        var easy = Math.round(20 / 100 * qcount);
                        foreachQuestionCount(easy, skills[i].skillId, 1, dbConnection, assessmentId);
                        var intermediate = Math.round(30 / 100 * qcount);
                        foreachQuestionCount(intermediate, skills[i].skillId, 2, dbConnection, assessmentId);
                        var hard = Math.round(50 / 100 * qcount);
                        foreachQuestionCount(hard, skills[i].skillId, 3, dbConnection, assessmentId);
                    }
                    else if (skills[i].cmpId == 2) {
                        var qcount = Math.round(100 / 100 * tque);
                        var easy = Math.round(20 / 100 * qcount);
                        foreachQuestionCount(easy, skills[i].skillId, 1, dbConnection, assessmentId);
                        var intermediate = Math.round(60 / 100 * qcount);
                        foreachQuestionCount(intermediate, skills[i].skillId, 2, dbConnection, assessmentId);
                        var hard = Math.round(20 / 100 * qcount);
                        foreachQuestionCount(hard, skills[i].skillId, 3, dbConnection, assessmentId);
                    }
                    else if (skills[i].cmpId == 1) {
                        var qcount = Math.round(100 / 100 * tque);
                        var easy = Math.round(60 / 100 * qcount);
                        foreachQuestionCount(easy, skills[i].skillId, 1, dbConnection, assessmentId);
                        var intermediate = Math.round(30 / 100 * qcount);
                        foreachQuestionCount(intermediate, skills[i].skillId, 2, dbConnection, assessmentId);
                        var hard = Math.round(10 / 100 * qcount);
                        foreachQuestionCount(hard, skills[i].skillId, 3, dbConnection, assessmentId);
                    }
                }
            }
            k = 0;
            let result = {
                StatusCode: 200,
                StatusType: "Success",
                StatusMessage: "Question and Answers have been successfully inserted in AssessmentStaging",
                StatusSeverity: "Information Stored",
                assessmentId: assessmentId
            }
            setTimeout(() => {
                res.status(200).json(result);
                // dbConnection.close();
            }, 2000)
        }
        async function foreachQuestionCount(n, sid, cid, dbConnection, assessmentId) {
            await ExecuteQuery(dbConnection, ` select  * from Questions where  skillId=${sid} and cmpId=${cid}`)
                .then(async (questions) => {
                    if (questions.length != 0) {
                        for (let item of questions) {
                            q.push(item.queId);
                        }
                    }
                    console.log(q + "- questions array");
                })
                .catch((err) => {
                    console.log(err + 6);
                })
            for (let j = 0; j < n; j++) {
                await getAnswer(q, dbConnection, assessmentId);
            }
            toClear(q);
        }
        async function getAnswer(arr, dbConnection, assessmentId) {
            var l = arr.length;
            a = getrandomId(l);
            console.log(arr[a] + "arr[a]")
            var v = arr[a];
            await ExecuteQuery(dbConnection, `Select ansId from Questions_and_Answers where queId = ${v}`)
                .then(async (answer) => {
                    if (answer.length != 0) {
                        k++;
                        console.log(k + "--Q count");
                        ansId = answer[0].ansId;
                        console.log(ansId + " - answerId " + v + "- queId");
                        await ExecuteQuery(dbConnection, `Insert into AssessmentStaging(RowandQuestion_number,
                            AssessmentStagingstatus,queId,ansId,canId,assessmentId) 
                            values(${k},'Open',${v},${ansId},${canId},${assessmentId})`)
                            .then((row) => {
                                if (row) {
                                    console.log(row + "inserted staging");
                                }
                            })
                            .catch((err) => {
                                console.log(err + 5);
                            })
                    }
                })
                .catch((err) => {
                    console.log(err + 4);
                })
        }
    }
});
module.exports = router;