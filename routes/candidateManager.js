var express = require("express");
var router = express.Router();
var details = require("../db");
// var sql = require("mssql");
var sql = require("msnodesqlv8");
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var app = express();

var jsonParser = bodyParser.json()

// router.post("/", jsonParser, (req, res) => {

//     if(req.body != undefined){
//         const canName = req.body.canName;
//         const canPhone = req.body.canPhone;
//         const canEmail = req.body.canEmail;
//         const canExperience = req.body.canExperience;
//         const message = req.body.message;
//         const Resume = req.body.Resume;
//         const skills =req.body.skills;

//         console.log(skills);

  
//         if(skills.length==1)
//         {
//             const {skillId, compId} = skills[0];

//             function getData() {
//                 // Create connection instance
//                 var conn = new sql.ConnectionPool(details.config);
            
//                 conn
//                   .connect()
//                   // Successfull connection
//                   .then(function () {
//                     // Create request instance, passing in connection instance
//                     var req = new sql.Request(conn);
            
//                     // Call mssql's query method passing in params
//                     req
//                       .query(
//                         `INSERT INTO Candidate values('${canName}',${canPhone},'${canEmail}',${canExperience},'${message}','${Resume}',${compId},${skillId})`
//                       )
//                       .then(function (recordset) {
//                         console.log(recordset);
//                         const{recordset: data} = recordset;
//                         const jData = {data};
//                          res.send(jData);
//                         conn.close();
//                       })
//                       // Handle sql statement execution errors
//                       .catch(function (err) {
//                         console.log(err);
//                         res.send(err);
//                         conn.close();
//                       });
//                   })
//                   // Handle connection errors
//                   .catch(function (err) {
//                     console.log(err);
//                     res.send(err);
//                     conn.close();
//                   });
//               }
            
//               getData();
//         }
//         if(skills.length==2)
//         {
//             const {skillId: sId1, compId: cId1} = skills[0];
//             const {skillId: sId2, compId: cId2} = skills[1];
            
//             function getData() {
//                 // Create connection instance
//                 var conn = new sql.ConnectionPool(details.config);
            
//                 conn
//                   .connect()
//                   // Successfull connection
//                   .then(function () {
//                     // Create request instance, passing in connection instance
//                     var req = new sql.Request(conn);
            
//                     // Call mssql's query method passing in params
//                     req
//                       .query(
//                         `INSERT INTO Candidate values('${canName}',${canPhone},'${canEmail}',${canExperience},'${message}','${Resume}',${cId1},${sId1})`,
//                         `INSERT INTO Candidate values('${canName}',${canPhone},'${canEmail}',${canExperience},'${message}','${Resume}',${cId2},${sId2})`
//                       )
//                       .then(function (recordset) {
//                         console.log(recordset);
//                         const{recordset: data} = recordset;
//                         const jData = {data};
//                          res.send(jData);
//                         conn.close();
//                       })
//                       // Handle sql statement execution errors
//                       .catch(function (err) {
//                         console.log(err);
//                         res.send(err);
//                         conn.close();
//                       });
//                   })
//                   // Handle connection errors
//                   .catch(function (err) {
//                     console.log(err);
//                     res.send(err);
//                     conn.close();
//                   });
//               }
            
//               getData();
//         }
//         if(skills.length==3)
//         {
//             const {skillId: sId1, compId: cId1} = skills[0];
//             const {skillId: sId2, compId2: cId2} = skills[1];
//             const {skillId3: sId3, compId3: cId3} = skills[2];

//             function getData() {
//                 // Create connection instance
//                 var conn = new sql.ConnectionPool(details.config);
            
//                 conn
//                   .connect()
//                   // Successfull connection
//                   .then(function () {
//                     // Create request instance, passing in connection instance
//                     var req = new sql.Request(conn);
            
//                     // Call mssql's query method passing in params
//                     req
//                       .query(
//                         `INSERT INTO Candidate values('${canName}',${canPhone},'${canEmail}',${canExperience},'${message}','${Resume}',${cId1},${sId1})`,
//                         `INSERT INTO Candidate values('${canName}',${canPhone},'${canEmail}',${canExperience},'${message}','${Resume}',${cId2},${sId2})`,
//                         `INSERT INTO Candidate values('${canName}',${canPhone},'${canEmail}',${canExperience},'${message}','${Resume}',${cId3},${sId3})`
//                       )
//                       .then(function (recordset) {
//                         console.log(recordset);
//                         const{recordset: data} = recordset;
//                         const jData = {data};
//                          res.send(jData);
//                         conn.close();
//                       })
//                       // Handle sql statement execution errors
//                       .catch(function (err) {
//                         console.log(err);
//                         res.send(err);
//                         conn.close();
//                       });
//                   })
//                   // Handle connection errors
//                   .catch(function (err) {
//                     console.log(err);
//                     res.send(err);
//                     conn.close();
//                   });
//               }
            
//               getData();

//         }
        
//     }else{
//         res.send("Error");
//     }
//   });


router.post("/", jsonParser, (req, res)=>{
  
})

  router.get("/", (req, res) => {
    // res.send("Home Page of qaManager");
    function getData() {
     // Create connection instance
     var conn = new sql.ConnectionPool(details.config);
    
     conn.connect()
     // Successfull connection
     .then(function () {
    
       // Create request instance, passing in connection instance
       var req = new sql.Request(conn);
    
       // Call mssql's query method passing in params
       req.query(`SELECT canName FROM Candidate WHERE canEmail='${canEmail}'`)
       .then(function (recordset) {
         console.log(recordset);
         const {recordset: data} = recordset;
         res.status(200).json(data);
         conn.close();
       })
       // Handle sql statement execution errors
       .catch(function (err) {
         console.log(err);
         conn.close();
       })
    
     })
     // Handle connection errors
     .catch(function (err) {
       console.log(err);
       conn.close();
     });
    }
    
    getData();
   });

  module.exports = router;