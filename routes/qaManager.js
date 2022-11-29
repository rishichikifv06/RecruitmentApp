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
//                   conn.close();
//                 })
//                 // Handle sql statement execution errors
//                 .catch(function (err) {
//                   console.log(err);
//                   res.send(err);
//                   conn.close();
//                 });
//             })
//             // Handle connection errors
//             .catch(function (err) {
//               console.log(err);
//               res.send(err);
//               conn.close();
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
          await ExecuteQuery(dbConnection, `select Question,Questions.queId,Answer,Answers.ansId from Questions_and_Answers left join Answers on Answers.ansId=Questions_and_Answers.ansId
          inner join Questions on Questions.queId=Questions_and_Answers.queId where Questions.skillId=${skillId} and Questions.cmpId=${cmpId}`)
          .then((result)=>{
            res.status(200).json({result});
            dbConnection.close();
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
       }).catch((err)=>{
        console.log(err);
        dbConnection.close();
       })
    }
   
    getAllQandA();
  }
})

module.exports = router;
