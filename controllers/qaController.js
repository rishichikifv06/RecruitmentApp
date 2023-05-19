const { ConnectToDb, ExecuteQuery } = require("../db");
const {fileNanme,logger} = require('../log4');
const csv = require("csvtojson");
const excelToJson = require('convert-excel-to-json');

var fname;

fileNanme(__filename).then((data)=>{
    fname=data;
})

const fetchAllQa = (req, res) => {
  try {
    logger.trace(`file: ${fname},postMethod getAllQandA is called`);

    const cmpId = req.body.compId;
    const skillId = req.body.skillId;

    async function getAllQandA() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          await ExecuteQuery(
            dbConnection,
            `select question,questions.queid,answer,answer.ansId,answer.answerkeywords from questions_and_answers 
          left join answer on answer.ansid=questions_and_answers.ansId inner join questions on questions.queid=questions_and_answers.queid 
          where questions.skillid=${skillId} and questions.cmpid=${cmpId}`
          )
            .then(async (result) => {
                logger.info(`file: ${fname} , statuscode : 200`)

              await res.status(200).json({
                Status: {
                  StatusCode: 200,

                  StatusType: "Success",

                  StatusMessage: "Record Found",

                  StatusSeverity: "Information",
                },
                result,
              });
              dbConnection.release();
            })
            .catch(async (err) => {
              logger.fatal(`file: ${fname},error: ${err} -1`); 
              await res.status(500).json({ err });
              dbConnection.release();
            });
        })
        .catch(async (err) => {
          logger.fatal(`file: ${fname},error: ${err} -2`); 
          await res.Status(500).json({ err });
        });
    }

    getAllQandA();
  } catch (error) {
    console.log(error);
  }
};

const insertQaToDb = (req, res) => {
  let insertedQuesId;
  let insertedAnsId;
  try {
    logger.trace(`file: ${fname},postMethod InsertintoQuestions is called`);
    const cmpId = req.body.cmpId;
    const skillId = req.body.skillId;
    const Question = req.body.Question;
    const Answer = req.body.Answer;
    const Answerkeywords = req.body.Answerkeywords;
    console.log(skillId, cmpId, Question, Answer);
    var Qid;
    var Aid;
    async function InsertintoQuestions() {
      //Insert Question
      await ConnectToDb()
        .then(async (dbConnection) => {
              await ExecuteQuery(
                dbConnection,
                `insert into questions(question,skillid,cmpid) values('${Question}',${skillId},${cmpId})`
              )
                .then(async (result) => {
                  if (result) {
                    console.log(result);
                    insertedQuesId= result.insertId
                    //await getQueID(dbConnection); //to get queId
                    await InsertAnswer(dbConnection);
                  }
                  //dbConnection.release();
                })
                .catch((err) => {
                  console.log(err + 8);
                  logger.fatal(`file: ${fname},error: ${err} -3`);
                  //res.status(500).json(err);
                  dbConnection.release();
                });
        })
        .catch((err) => {
          console.log(err + 7);
        });
    }
    // async function getQueID(connection) {
    //   await ExecuteQuery(
    //     connection,
    //     `select queid from questions where question='${Question}'`
    //   )
    //     .then(async (que) => {
    //       if (que) {
    //         console.log(que);
    //         Qid = que[0].queid;
    //         console.log(Qid + "questions id");
    //         await InsertAnswer(connection);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err + 6);
    //       //res.send(err);
    //     });
    // }
    async function InsertAnswer(dbConnection) {
          await ExecuteQuery(
            dbConnection,
            `insert into answer(answer,answerkeywords) values('${Answer}','${Answerkeywords}')`
          )
            .then(async (record) => {
              if (record) {
                console.log(record + 2);
                insertedAnsId = record.insertId
                //await getAnswerID(dbConnection); //get ansId
                await InsertIntoLinkTable();
              }
              dbConnection.release();
            })
            .catch((err) => {
              console.log(err + 5);
              //res.status(500).json(err);
              dbConnection.release();
            });
    }
    // async function getAnswerID(dbConnection) {
    //   await ExecuteQuery(
    //     dbConnection,
    //     `select ansid from answer where answer='${Answer}'`
    //   )
    //     .then(async (ans) => {
    //       if (ans) {
    //         console.log(ans);
    //         Aid = ans[0].ansid;
    //         console.log(Aid + "answer id");
    //         await InsertIntoLinkTable();
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err + 3);
    //     });
    // }
    InsertintoQuestions(); //insert into Questions table
    async function InsertIntoLinkTable() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          await ExecuteQuery(
            dbConnection,
            `insert into questions_and_answers(queid,ansid) values(${insertedQuesId},${insertedAnsId})`
          )
            .then((result) => {
              console.log(result + "QandA");
              const status = {
                StatusCode: 200,
                StatusType: "success",
                Message: "Question and Answer inserted successfully!!",
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
    console.log(error);
  }
};


const updateQInDb = (req,res) => {
    try {
        logger.trace(`file: ${fname},postMethod EditQuestion is called`);
    const queId = req.body.queId;
    const Question= req.body.Question
    async function EditQuestion()
    {
      await ConnectToDb().then(async (dbConnection)=>{
          await ExecuteQuery(dbConnection, `Update questions set question='${Question}' where queid=${queId}`)
          .then(async (result)=>{
            if(result){
              var status={
                StatusCode: 200,
                StatusType: "success",
                StatusMessage: "Question is updated",
                StatusSeverity: "Updated into database"
              }
              logger.info(`file: ${fname} , statuscode : 200`)
              await res.status(200).json(status);
              await dbConnection.release();
            }
          })
          .catch(async(err)=>{
            logger.fatal(`file: ${fname},error: ${err} -4`); 
            await res.status(500).json(err);
            await dbConnection.release();
          })

       }).catch(async (err)=>{
        logger.fatal(`file: ${fname},error: ${err} -5`); 
        await dbConnection.release();
       })
    }
    EditQuestion();
    } catch (error) {
        console.log(error);
    }
}

const updateAInDb = (req,res) => {
    try {
        logger.trace(`file: ${fname},postMethod EditAnswer is called`);
        const ansId = req.body.ansId;
        const Answer= req.body.Answer
        const answerkeywords = req.body.answerkeywords;
        async function EditAnswer()
        {
          await ConnectToDb().then(async (dbConnection)=>{
              await ExecuteQuery(dbConnection, `Update answer set answer='${Answer}',answerkeywords='${answerkeywords}' where ansid=${ansId}`)
              .then(async (result)=>{
                if(result){
                  var status={
                    StatusCode: 200,
                    StatusType: "success",
                    StatusMessage: "Answer is updated",
                    StatusSeverity: "Updated into database"
                  }
                  logger.info(`file: ${fname} , statuscode : 200`)
                  await res.status(200).json(status);
                  await dbConnection.release();
                }
              })
              .catch(async (err)=>{
                logger.fatal(`file: ${fname},error: ${err} -6`); 
                await res.status(500).json(err);
                await dbConnection.release();
              })
           }).catch(async (err)=>{
            logger.fatal(`file: ${fname},error: ${err} -7`); 
            await dbConnection.release();
           })
        }
        EditAnswer();
    } catch (error) {
        console.log(error);
    }
}




module.exports = {
  fetchAllQa,
  insertQaToDb,
  updateQInDb,
  updateAInDb
};
