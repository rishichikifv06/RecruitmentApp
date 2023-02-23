const { ConnectToDb, ExecuteQuery } = require("../db");
const {fileNanme,logger} = require('../log4');

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
          console.log( `select question,questions.queId,answer,answer.ansId,answer.answerkeywords from questions_and_answers 
          left join answer on answer.ansId=questions_and_answers.ansId inner join questions on questions.queId=questions_and_answers.queId 
          where questions.skillId=${skillId} and questions.cmpId=${cmpId}`);
          await ExecuteQuery(
            dbConnection,
            `select question,questions.queId,answer,answer.ansId,answer.answerkeywords from questions_and_answers 
          left join answer on answer.ansId=questions_and_answers.ansId inner join questions on questions.queId=questions_and_answers.queId 
          where questions.skillId=${skillId} and questions.cmpId=${cmpId}`
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

const insertQaToDb = (req,res) => {
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
              `select question from questions where question='${Question}' and skillId=${skillId} and cmpId=${cmpId}`
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
                  `insert into questions(Question,skillId,cmpId) values('${Question}',${skillId},${cmpId})`
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
        `select queId from questions where Question='${Question}'`
      )
        .then(async (que) => {
          if (que) {
            console.log(que);
            Qid = que[0].queId;
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
        `select answers.Answer, questions.cmpId, questions.skillId from questions_and_answers
      left join answers on questions_and_answers.ansId=answers.ansId
      left join questions on questions_and_answers.queId=questions.queId
      where questions.cmpId=${cmpId} and questions.skillId=${skillId} and answers.Answer='${Answer}'`
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
            `insert into answers(Answer,Answerkeywords) values('${Answer}','${Answerkeywords}')`
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
        `select ansId from answers where Answer='${Answer}'`
      )
        .then(async (ans) => {
          if (ans) {
            console.log(ans);
            Aid = ans[0].ansId;
            console.log(Aid + "answer id");
            await InsertIntoLinkTable();
          }
        })
        .catch((err) => {
          console.log(err + 3);
        });
    }
    InsertintoQuestions(); //insert into Questions table
    async function InsertIntoLinkTable() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          await ExecuteQuery(
            dbConnection,
            `insert into questions_and_answers(queId,ansId) values(${Qid},${Aid})`
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
          await ExecuteQuery(dbConnection, `Update questions set Question='${Question}' where queId=${queId}`)
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
        const Answer= req.body.Answer;
        const answerkeywords= req.body.answerkeywords;
        async function EditAnswer()
        {
          await ConnectToDb().then(async (dbConnection)=>{
              await ExecuteQuery(dbConnection, `Update answer set Answer='${Answer}', answerkeywords = '${answerkeywords}' where ansId=${ansId}`)
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
