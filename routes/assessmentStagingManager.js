var express = require("express");
var router = express.Router();
var details = require("../db");
// var sql = require("mssql");
var sql = require("msnodesqlv8");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

// function getData(qId, aId) {
//   // Create connection instance
//   var conn = new sql.ConnectionPool(details.config);
//   conn
//     .connect()
//     // Successfull connection
//     .then(function () {
//       // Create request instance, passing in connection instance
//       var req = new sql.Request(conn);
//       // Call mssql's query method passing in params
//       req
//         .query(`INSERT INTO AsessmentStaging VALUES()`)
//         .then(function (recordset) {
//           console.log(recordset);
//           const { recordset: data } = recordset;
//           const jData = { data };
//           conn.close();
//         })
//         // Handle sql statement execution errors
//         .catch(function (err) {
//           console.log(err);
//           conn.close();
//         });
//     })
//     // Handle connection errors
//     .catch(function (err) {
//       console.log(err);
//       conn.close();
//     });
// }

// if(data.length != 0){
//     for(var i=0; i<data.length; i++){
//         getData(data[i].qId, data[i].aId);
//     }
// }

// router.post("/", jsonParser, (req, res) => {

//     if(req.body != undefined){
//         const id = req.body.id;
//         const compId = req.body.compId;
//         const skillId = req.body.skillId;

//         function getData() {
//             // Create connection instance
//             var conn = new sql.ConnectionPool(details.config);

//             conn
//               .connect()
//               // Successfull connection
//               .then(function () {
//                 // Create request instance, passing in connection instance
//                 var req = new sql.Request(conn);

//                 // Call mssql's query method passing in params
//                 req
//                   .query(
//                     `SELECT Question, Answer, queansId FROM AssessmentStaging WHERE compId=${compId} AND skillId =${skillId}`
//                   )
//                   .then(function (recordset) {
//                     console.log(recordset);
//                     const{recordset: data} = recordset;
//                      res.send(( data[id]));
//                     conn.close();
//                   })
//                   // Handle sql statement execution errors
//                   .catch(function (err) {
//                     console.log(err);
//                     res.send(err);
//                     conn.close();
//                   });
//               })
//               // Handle connection errors
//               .catch(function (err) {
//                 console.log(err);
//                 res.send(err);
//                 conn.close();
//               });
//           }

//           getData();

//     }else{
//         res.send("Error");
//     }
//   });

// function getrandomId() {
//   return Math.floor(Math.random() * 1000);
// }
// function forqcount(n, sid, cid) {
//   for (var j = 0; j < n; j++) {
//     a = getrandomId();
//     //select query with where condition id =a and skill,comp of que_and_ans table
//     async function getData() {
//       await sql.open(details.connectionString, async (err, conn) => {
//         await conn.query(`select * from QandA where qid='${a}' and skillId='${sid}' and cmpId='${cid}`, (err, data) => {
//           if (data) {
//             console.log(data);
//             const result = { data };
//             res.status(200).json(result);
//           }
//           if (err) {
//             console.log(err);
//             res.send(err);
//           }
//         });
//         if (err) {
//           console.log(err);
//           res.send(err);
//         }
//       });
//     }

//     getData();
//   }
// }

// var tque = 20;

// router.post("/", (req, res) => {
//   const skills = req.body.skills;

//   if (skills.length === 3) {
//     for (var i = 0; i < count; i++) {
//       if (skills[i].cid == 3) {
//         qcount = (50 / 100) * tque;
//         var easy = 2;
//         forqcount(easy, skills[i].sid, 1);
//         var intermediate = 3;
//         forqcount(intermediate, skills[i].sid, 2);
//         var hard = 5;
//         forqcount(hard, skills[i].sid, 3);

//         //console.log(qcount);
//       } else if (skills[i].cid == 2) {
//         qcount = (30 / 100) * tque;
//         var easy = 2;
//         forqcount(easy, skills[i].sid, 1);
//         var intermediate = 4;
//         forqcount(intermediate, skills[i].sid, 2);
//         // console.log(qcount);
//       } else if (skills[i].cid == 1) {
//         qcount = (20 / 100) * tque;
//         var easy = 3;
//         forqcount(easy, skills[i].sid, 1);
//         var intermediate = 1;
//         forqcount(intermediate, skills[i].sid, 2);
//       }
//     }
//   }
// });


router.post("/", jsonParser, (req, res) => {

   var canId = req.body.canId;
   var RowandQuestion_number = req.body.RowandQuestion_number;

  

  async function getData()
  {
    await sql.open(details.connectionString, async (err, conn)=>{
    await  conn.query(`SELECT Questions.Question, Answers.Answer, AssessmentStaging.RowandQuestion_number FROM AssessmentStaging
    LEFT JOIN Questions ON Questions.queId=AssessmentStaging.queId LEFT JOIN Answers ON Answers.ansId=AssessmentStaging.ansId
    WHERE canId=${canId} AND RowandQuestion_number = ${RowandQuestion_number}`,(err, data)=>{
        if(data){
          data[0].currentRecordId = RowandQuestion_number;
          data[0].firsRecordId = 1;
          data[0].nextRecordId = RowandQuestion_number+1;
          data[0].previosRecordId = RowandQuestion_number-1;
          data[0].lastRecordId = 20;
          console.log(data);
          const result = { data };
          res.status(200).json(result);
        }
        if(err){
          console.log(err);
          res.send(err);
        }
      })
      if(err){
        console.log(err);
        res.send(err);
      }
    })
  }
 
  getData();
})


router.post("/saveData", jsonParser, (req, res)=>{
  var canId = req.body.canId;
  var RowandQuestion_number = req.body.RowandQuestion_number;
  var score = req.body.score;
  var notes = req.body.notes;
  console.log(notes);

  async function getData()
  {
    await sql.open(details.connectionString, async (err, conn)=>{
    await  conn.query(`UPDATE AssessmentStaging SET score=${score} ,Note='${notes}' WHERE canId = ${canId} AND 
    RowandQuestion_number = ${RowandQuestion_number}`,(err, data)=>{
        if(data){
          var success = {
            status: "Success",
            message: `The response is saved successfully for candidateId ${canId} and question number ${RowandQuestion_number}`}

          res.status(200).json(success);
        }
        if(err){
          console.log(err);
          res.send(err);
        }
      })
      if(err){
        console.log(err);
        res.send(err);
      }
    })
  }
 
  getData();
})

module.exports = router;
