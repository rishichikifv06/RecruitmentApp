var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');
var path = require("path");
const multer = require("multer");
const csv = require("csvtojson");
const { render } = require("../app");


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'upload/')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + "__" + file.originalname)
  }
});

var upload = multer({ storage: storage }).single('filename');

router.get("/form",(req,res)=>{
    res.render('form');
})  

router.post("/uploadQA",upload,(req,res)=>{
console.log("update")
        try {
            console.log(req.files.file)
          let filename = req.files.file.name
          let file = filename.split('.')
          let fileextn = file[file.length - 1]
          console.log(filename,"filename");
          filepath = path.join(__dirname, './upload', filename)
          filedir = '/upload';
          console.log(filedir,"filedir");
          /*to read csv file */
      
          if (fileextn === 'csv') {
              async function readcsvFile(filename) {
                  csv()
                      .fromFile(filename)
                      .then(async (jsonObj) => {
                          console.log(jsonObj);
                          finalData = jsonObj;
                          for(let item in jsonObj){
                            console.log(jsonObj[1],"jsonobj array 1");
                            // InsertintoQuestions(jsonObj[item]);
                          }
                          // res.send(finalData);
      
                      })
                      .catch((err) => {
                          console.log(err.message);
                      });
              }
              readcsvFile(filepath);
          }
       
          var Qid;
          var Aid;
      
          async function InsertintoQuestions(data) {
            //Insert Question
            await ConnectToDb()
              .then(async (dbConnection) => {
                  await ExecuteQuery(
                    dbConnection,
                    `select question from questions where question='${Question}' and skillid=${skillId} and cmpid=${cmpId}`
                  ).then(async (questionData) => {
                    if (questionData.length != 0) {
                      var status = {
                        Message: "The Question is already present!!",
                      };
                      logger.info(`file: ${fname} , statuscode : 200`)
                      await res.status(200).json(status);
                      await dbConnection.release();
                    } else {
                      await ExecuteQuery(
                        dbConnection,
                        `insert into questions(question,skillid,cmpid) values('${Question}',${skillId},${cmpId})`
                      )
                        .then(async (result) => {
                          if (result) {
                            console.log(result);
                            await getQueID(dbConnection); //to get queId
                          }
                          //dbConnection.release();
                        })
                        .catch((err) => {
                          console.log(err + 8);
                          logger.fatal(`file: ${fname},error: ${err} -3`); 
      
                          //res.status(500).json(err);
                          dbConnection.release();
                        });
                    }
                  });
              })
              .catch((err) => {
                console.log(err + 7);
              });
          }
          async function getQueID(connection) {
            await ExecuteQuery(
              connection,
              `select queid from questions where question='${Question}'`
            )
              .then(async (que) => {
                if (que) {
                  console.log(que);
                  Qid = que[0].queid;
                  console.log(Qid + "questions id");
                  await InsertAnswer(connection);
                }
              })
              .catch((err) => {
                console.log(err + 6);
                //res.send(err);
              });
          }
          async function InsertAnswer(dbConnection) {
            await ExecuteQuery(
              dbConnection,
              `select answer.answer, questions.cmpid, questions.skillid from questions_and_answers
            left join answer on questions_and_answers.ansid=answer.ansid
            left join questions on questions_and_answers.queid=questions.queid
            where questions.cmpid=${cmpId} and questions.skillid=${skillId} and answer.answer='${Answer}'`
            ).then(async (answerData) => {
              if (answerData.length != 0) {
                var status = {
                  Message: "The Answer is already present!!",
                };
                res.status(200).json(status);
                dbConnection.release();
              } else {
                await ExecuteQuery(
                  dbConnection,
                  `insert into answer(answer,answerkeywords) values('${Answer}','${Answerkeywords}')`
                )
                  .then(async (record) => {
                    if (record) {
                      console.log(record + 2);
                      await getAnswerID(dbConnection); //get ansId
                    }
                    dbConnection.release();
                  })
                  .catch((err) => {
                    console.log(err + 5);
                    //res.status(500).json(err);
                    dbConnection.release();
                  });
              }
            });
          }
          async function getAnswerID(dbConnection) {
            await ExecuteQuery(
              dbConnection,
              `select ansid from answer where answer='${Answer}'`
            )
              .then(async (ans) => {
                if (ans) {
                  console.log(ans);
                  Aid = ans[0].ansid;
                  console.log(Aid + "answer id");
                  await InsertIntoLinkTable();
                }
              })
              .catch((err) => {
                console.log(err + 3);
              });
          }
          
          async function InsertIntoLinkTable() {
            await ConnectToDb()
              .then(async (dbConnection) => {
                await ExecuteQuery(
                  dbConnection,
                  `insert into questions_and_answers(queid,ansid) values(${Qid},${Aid})`
                )
                  .then((result) => {
                    console.log(result + "QandA");
                    const status = {
                      StatusCode: 200,
                      StatusType: "success",
                      StatusMessage: "Question and Answer inserted successfully!!",
                      StatusSeverity: "Inserted into database",
                    };
                    res.status(200).json(status);
                    dbConnection.release();
                  })
                  .catch((err) => {
                    console.log(err + 2);
                    res.status(500).json({ err });
                    dbConnection.release();
                  });
              })
              .catch((err) => {
                console.log(err + 1);
                res.status(500).json({ err });
                dbConnection.release();
              });
          }
      
        } catch (error) {
          console.log(error,"from uploadQA")
        }
      
})

module.exports = router;
