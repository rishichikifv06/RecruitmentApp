const fs = require("fs");
const csv = require("csvtojson");
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const { ConnectToDb, ExecuteQuery } = require("../db");

router.post("/upload", jsonParser, (req, res) => {
  const uploadedfile = req.body.uploadedfile;
  var queId;
  var ansId;
  var skillId;
  var cmpId;
  var count = 0;
  var jsonObjCount = 0;

  async function readcsvFile() {
    csv()
      .fromFile(uploadedfile)
      .then(async (jsonObj) => {
        console.log(jsonObj);
        for (let i = 0; i < jsonObj.length; i++) {
          if (
            jsonObj[i].question.length != 0 &&
            jsonObj[i].answer.length != 0 &&
            jsonObj[i].skillId.length != 0 &&
            jsonObj[i].cmpId.length != 0
          ) {
            jsonObjCount++;
          }
        }
        if (jsonObjCount != jsonObj.length) {
          res.status(500).json({
            Status: {
              StatusCode: 500,

              StatusType: "Failed",

              StatusMessage:
                "Data not uploaded you have some fields empty in your csv",

              StatusSeverity: "Information not updated",
            },
          });
          console.log(
            "Data not inserted you have some fields empty in your csv"
          );
        } else {
          await uploadfile(jsonObj);
        }
      })
      .catch((err) => {
        console.log(err + 7);
      });
  }
  async function uploadfile(jsonObj) {
    await ConnectToDb()
      .then(async (dbConnection) => {
        for (let i = 0; i < jsonObj.length; i++) {
          skillId = parseInt(jsonObj[i].skillId);
          cmpId = parseInt(jsonObj[i].cmpId);
          await ExecuteQuery(
            dbConnection,
            `insert into Questions(Question,cmpId,skillId) values(
            '${jsonObj[i].Question}',${cmpId},${skillId})`
          )
            .then(async (question) => {
              await getQuestionId(
                dbConnection,
                skillId,
                cmpId,
                jsonObj[i].Question
              );
            })
            .catch((err) => {
              console.log("Question not inserted");
              console.log(err + 1);
            });
          await ExecuteQuery(
            dbConnection,
            `insert into Answers(Answer) values('${jsonObj[i].Answer}')`
          )
            .then(async (answer) => {
              await getAnswerId(dbConnection, jsonObj[i].Answer).then(
                async (answerId) => {
                  if (ansId != undefined && queId != undefined) {
                    await ExecuteQuery(
                      dbConnection,
                      `insert into Questions_and_Answers(queId,ansId) values(${queId},${ansId})`
                    )
                      .then(async (data) => {
                        console.log(
                          queId,
                          ansId,
                          "questionid  and answerid after inserting "
                        );
                        count++;
                      })
                      .catch((err) => {
                        console.log("Q&A id's not inserted");
                        console.log(err + 6);
                      });
                  }
                }
              );
            })
            .catch((err) => {
              console.log("Answer not inserted");
              console.log(err + 3);
            });
        }
        if (count == jsonObj.length) {
          var status = {
            status: "success",
            message: "inserted into Questions and Answers",
          };
          res.status(200).json(status);
          dbConnection.close();
        } else {
          var statusMessage = {
            status: "Failed",
            message: "Could not insert Questions and Answers !!!",
          };
          res.status(200).json(statusMessage);
          dbConnection.close();
        }
      })
      .catch((err) => {
        console.log("Not connected to db");
        console.log(err + 2);
      });
  }
  async function getQuestionId(dbConnection, skillId, cmpId, Question) {
    await ExecuteQuery(
      dbConnection,
      `select queId from Questions where Question='${Question}'
       and skillId=${skillId} and cmpId =${cmpId}`
    )
      .then((value) => {
        queId = value[0].queId;
        console.log(queId, "question id");
      })
      .catch((err) => {
        console.log(err + 5);
      });
  }
  async function getAnswerId(dbConnection, Answer) {
    await ExecuteQuery(
      dbConnection,
      `select ansId from Answers where Answer='${Answer}'`
    )
      .then((value) => {
        ansId = value[0].ansId;
        console.log(ansId, "answerId");
      })
      .catch((err) => {
        console.log(err + 4);
      });
  }
  readcsvFile();
});
module.exports = router;
