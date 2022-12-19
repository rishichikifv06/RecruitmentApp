var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');


function authUser(req, res, next) {
  if (req.user == null) {
    res.status(403);
    return res.send("You need to sign in");
  }
  next();
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);
      return res.send("Not Allowed");
    }
    next();
  };
}

function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin'); // redirect to sign-in route
  }

  next();
};



// router.post("/", jsonParser, (req, res) => {

//   if(req.body != undefined){
//       const id = req.body.id;
//       const compId = req.body.compId;
//       const skillId = req.body.skillId;

//       function getData() {
//           // Create connection instance
//           var conn = new sql.ConnectionPool(details.config);
      
//           conn
//             .connect()
//             // Successfull connection
//             .then(function () {
//               // Create request instance, passing in connection instance
//               var req = new sql.Request(conn);
      
//               // Call mssql's query method passing in params
//               req
//                 .query(
//                   `SELECT Question, Answer, queansId FROM QueandAns WHERE compId=${compId} AND skillId =${skillId}`
//                 )
//                 .then(function (recordset) {
//                   console.log(recordset);
//                   const{recordset: data} = recordset;
//                    res.send(( data[id]));
//                   conn.release();
//                 })
//                 // Handle sql statement execution errors
//                 .catch(function (err) {
//                   console.log(err);
//                   res.send(err);
//                   conn.release();
//                 });
//             })
//             // Handle connection errors
//             .catch(function (err) {
//               console.log(err);
//               res.send(err);
//               conn.release();
//             });
//         }
      
//         getData();


//   }else{
//       res.send("Error");
//   }
// });



router.post("/allQA", jsonParser, (req, res)=>{
  if(req.body != undefined){
    const cmpId = req.body.compId;
    const skillId = req.body.skillId;

    async function getAllQandA()
    {

      await ConnectToDb().then(async (dbConnection)=>{
        if(dbConnection){
          await ExecuteQuery(dbConnection, `select question,questions.queId,answer,answer.ansId from questions_and_answers 
          left join answer on answer.ansId=questions_and_answers.ansId inner join questions on questions.queId=questions_and_answers.queId 
          where questions.skillId=${skillId} and questions.cmpId=${cmpId}`)
          .then((result)=>{
            res.status(200).json({
              Status: {
                StatusCode: 200,

                StatusType: "Success",

                StatusMessage: "Record Found",

                StatusSeverity: "Information",
              },
              result});
            dbConnection.release();
          })
          .catch((err)=>{
            console.log(err);
            res.status(500).json(err);
            dbConnection.release();
          })
        }
        else{
          console.log("Not connected to db");
        }
       }).catch((err)=>{
        console.log(err);
        dbConnection.release();
       })
    }
   
    getAllQandA();
  }
})

router.post("/insertQA", jsonParser, (req, res)=>{
  if(req.body != undefined){

    const cmpId = req.body.cmpId;
    const skillId = req.body.skillId;
    const Question = req.body.Question;
    const Answer = req.body.Answer;
    const Answerkeywords = req.body.Answerkeywords;

    console.log(skillId,cmpId,Question,Answer);
    var Qid;
    var Aid;

    async function InsertintoQuestions()//Insert Question
    {
      await ConnectToDb().then(async (dbConnection)=>{
        if(dbConnection){
          await ExecuteQuery(dbConnection, `select question from questions where question='${Question}' and skillId=${skillId} and cmpId=${cmpId}`)
          .then(async (questionData)=>{
            if(questionData.length!=0){
              var status = {
                Message: "The Question is already present!!"
              }
              res.status(200).json(status);
              dbConnection.release();
            }

            else{

              await ExecuteQuery(dbConnection, `insert into questions(Question,skillId,cmpId) values('${Question}',${skillId},${cmpId})`)
              .then(async (result)=>{
                if(result){
                  console.log(result);
                  await getQueID(dbConnection); //to get queId
                }
                //dbConnection.release();
              })
              .catch((err)=>{
                console.log(err+8);
                //res.status(500).json(err);
                dbConnection.release();
              })
            }
          })
        }
        else{
          console.log("Not connected to db");
        }
       }).catch((err)=>{
        console.log(err+7);
       })
    }
    async function getQueID(connection)
    {
        await ExecuteQuery(connection,`select queId from questions where Question='${Question}'`)
        .then(async(que)=>{
          if(que){
            console.log(que);
            Qid=que[0].queId;
            console.log(Qid +"questions id");
            await InsertAnswer(connection);
          }
        })
        .catch((err)=>{
          console.log(err+6);
          //res.send(err);
        })
    }
    async function InsertAnswer(dbConnection){ 
      await ExecuteQuery(dbConnection, `select answers.Answer, questions.cmpId, questions.skillId from questions_and_answers
      left join answers on questions_and_answers.ansId=answers.ansId
      left join questions on questions_and_answers.queId=questions.queId
      where questions.cmpId=${cmpId} and questions.skillId=${skillId} and answers.Answer='${Answer}'`)
      .then(async (answerData)=>{
        if(answerData.length!=0){
          var status = {
            Message: "The Answer is already present!!"
          }
          res.status(200).json(status);
          dbConnection.release();
        }
        else{

          await ExecuteQuery(dbConnection, `insert into answers(Answer,Answerkeywords) values('${Answer}','${Answerkeywords}')`)
          .then(async(record)=>{
            if(record){
              console.log(record+2);
              await getAnswerID(dbConnection); //get ansId
            }
            dbConnection.release();
          })
          .catch((err)=>{
            console.log(err+5);
            //res.status(500).json(err);
            dbConnection.release();
          })
        }
      })
        }
    async function getAnswerID(dbConnection){
      await ExecuteQuery(dbConnection,`select ansId from answers where Answer='${Answer}'`)
      .then(async(ans)=>{
        if(ans){
          console.log(ans);
          Aid=ans[0].ansId;
          console.log(Aid +"answer id");
          await InsertIntoLinkTable();
        }
      })
      .catch((err)=>{
        console.log(err+3);
      })
    }
    InsertintoQuestions();  //insert into Questions table
    async function InsertIntoLinkTable(){
      await ConnectToDb().then(async (dbConnection)=>{
          await ExecuteQuery(dbConnection,`insert into questions_and_answers(queId,ansId) values(${Qid},${Aid})`)
          .then((result)=>{
            console.log(result +"QandA");
            const status = {
              StatusCode: 200,
              StatusType: "success",
              StatusMessage: "Question and Answer inserted successfully!!",
              StatusSeverity: "Inserted into database"
            }
            res.status(200).json(status);
            dbConnection.release();
          })
          .catch((err)=>{
            console.log(err+2);
            res.status(500).json({err});
            dbConnection.release();
          })

      })
      .catch((err)=>{
        console.log(err +1);
        res.status(500).json({err});
        dbConnection.release();
      })
    }
  }
})
//update a question using question id
router.post("/updateQ", jsonParser, (req, res)=>{
  if(req.body != undefined){
    const queId = req.body.queId;
    const Question= req.body.Question
    async function EditQuestion()
    {
      await ConnectToDb().then(async (dbConnection)=>{
          await ExecuteQuery(dbConnection, `Update questions set Question='${Question}' where queId=${queId}`)
          .then((result)=>{
            if(result){
              var status={
                StatusCode: 200,
                StatusType: "success",
                StatusMessage: "Question is updated",
                StatusSeverity: "Updated into database"
              }
              res.status(200).json(status);
              dbConnection.release();
            }
          })
          .catch((err)=>{
            console.log(err);
            res.status(500).json(err);
            dbConnection.release();
          })

       }).catch((err)=>{
        console.log(err);
        dbConnection.release();
       })
    }
    EditQuestion();
  }
})

//update answer using answer Id
router.post("/updateA", jsonParser, (req, res)=>{
  if(req.body != undefined){
    const ansId = req.body.ansId;
    const Answer= req.body.Answer
    async function EditAnswer()
    {
      await ConnectToDb().then(async (dbConnection)=>{
          await ExecuteQuery(dbConnection, `Update answers set Answer='${Answer}' where ansId=${ansId}`)
          .then((result)=>{
            if(result){
              var status={
                StatusCode: 200,
                StatusType: "success",
                StatusMessage: "Answer is updated",
                StatusSeverity: "Updated into database"
              }
              res.status(200).json(status);
              dbConnection.release();
            }
          })
          .catch((err)=>{
            console.log(err);
            res.status(500).json(err);
            dbConnection.release();
          })
       }).catch((err)=>{
        console.log(err);
        dbConnection.release();
       })
    }
    EditAnswer();
  }
})

module.exports = router;
