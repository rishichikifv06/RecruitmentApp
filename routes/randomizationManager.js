var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var app = express();
//const { Connection, Request } = require("tedious");
var jsonParser = bodyParser.json();

// router.post("/",jsonParser, (req, res) => {

//   function getData() {
//     // Create connection instance
//     var conn = new sql.ConnectionPool(details.config);
//     conn
//       .connect()
//       // Successfull connection
//       .then(function () {
//         // Create request instance, passing in connection instance
//         var req = new sql.Request(conn);
//         // Call mssql's query method passing in params
//         req
//           .query(`INSERT INTO Asessment VALUES()`)
//           .then(function (recordset) {
//             console.log(recordset);
//             const { recordset: data } = recordset;
//             const jData = { data };
//             res.send(jData);
//             conn.close();
//           })
//           // Handle sql statement execution errors
//           .catch(function (err) {
//             console.log(err);
//             res.send(err);
//             conn.close();
//           });
//       })
//       // Handle connection errors
//       .catch(function (err) {
//         console.log(err);
//         res.send(err);
//         conn.close();
//       });
//   }
//   getData();
// });



// module.exports = router;

function getrandomId(number) {
  return Math.floor(Math.random() * number)
}
function toClear(array) {
  for (let z = 0; z < array.length; z++) {
    array.pop();
  }
}

var q=[];
router.post("/", jsonParser,(req, res) => {
  if(req.body !=undefined){
    const canId=req.body.canId;
    const recId=req.body.recId;
    const Date=req.body.Date;
    const starttime=req.body.starttime;
    const candidatestatus=req.body.Candidatestatus;
    const skills=req.body.skills;
    var ansId;
    var assessmentId;
    var k=0;
    //getAssessment();
    async function getAssId(conn){
      //await sql.open(details.connectionString,async(err,conn)=>{
       conn.query(`select assessmentId from Assessment where canId=${canId} and date='${Date}'`, (err, val) => {
         if(val){
            assessmentId=val[0].assessmentId;
           console.log(assessmentId);
             getQuestions(assessmentId)
             function getQuestions(assessmentId) {
      
              async function forqcount(n, sid, cid) {
                await sql.open(details.connectionString, async (err, conn) => {
                  await conn.query(
                    ` select  * from Questions where  skillId=${sid} and cmpId=${cid}`,
                    (err, data) => {
                      if (data) {
                        for (let item of data) {
                          q.push(item.queId)
                          
                        }//console.log( q + "q array");
                      }
                      if (err) {
                        //res.send(err);
                      }
                    });
                    if(err)
                    {
                        console.log(err+"2")
                    }
                })
                for (let j = 0; j < n; j++) {
                  getAnswer(q);
                }
                async function getAnswer( arr) {
                  var l=arr.length;
                     a = getrandomId(l);
                    console.log(arr[a]+  "arr[a]")
                    var v=arr[a];
                    await sql.open(details.connectionString, async (err, conn) => {
                      await conn.query(`Select ansId from Questions_and_Answers where queId = ${v}`, async (err, value) => {
                        
                        if (value) {
                          k++;
                          console.log(k);
                          ansId = value[0].ansId;
                          console.log(ansId +"answerId"+v);
                          await conn.query(`Insert into AssessmentStaging(RowandQuestion_number,AssessmentStagingstatus,queId,
                              ansId,canId,assessmentId) values (${k},'Open',${v},${ansId},${canId},${assessmentId})`, (err,row) => {
                            if(row)
                            {
                              
                              console.log(row);
                            }if(err){
                              console.log(err + "error while inserting");
                            }
                          });
                        }
                        if(err)
                        {
                            console.log(err+"1");
                        }
                      })
                      if(err){
                        console.log(err+"conn err");
                      }
                    });
                     toClear(q);
                  }
        
                
              }
              var count = skills.length
              var tque = 20;
               if(count ==4){

        for(let i=0;i<count;i++){

          if(skills[i].cmpId==3 || skills[i].cmpId==2 || skills[i].cmpId ==1){

            var qcount= Math.round(25/100 * tque);

            forqcount(qcount,skills[i].skillId,skills[i].cmpId);

          }

        }
      }
              if (count == 3) {
                for (let i = 0; i < count; i++) {
                  if (skills[i].cmpId == 3) {
                    var qcount = Math.round(50 / 100 * tque);
                    var easy = Math.round(20 / 100 * qcount);
                    forqcount(easy, skills[i].skillId, 1);
                    var intermediate = Math.round(30 / 100 * qcount);
                    forqcount(intermediate, skills[i].skillId, 2)
                    var hard = Math.round(50 / 100 * qcount);
                    forqcount(hard, skills[i].skillId, 3)
                    //console.log(qcount);
                  }
                   if (skills[i].cmpId == 2) {
                    var qcount = Math.round(30 / 100 * tque);
                    var easy = Math.round(30 / 100 * qcount);
                    forqcount(easy, skills[i].skillId, 1);
                    var intermediate = Math.round(70 / 100 * qcount);
                    forqcount(intermediate, skills[i].skillId, 2)
                    // console.log(qcount);
                  }
                  if(skills[i].cmpId==1){
                    var qcount = Math.round(20 / 100 * tque);
                    var easy = Math.round(70 / 100 * qcount);
                    forqcount(easy, skills[i].skillId, 1);
                    var intermediate = Math.round(30/100 * qcount);
                    forqcount(intermediate, skills[i].skillId, 2);
                  }
                }
              }
               if (count == 2) {
                for (var i = 0; i < count; i++) {
                  if (skills[i].cmpId == 3) {
                    var qcount = Math.round(50 / 100 * tque);
                    var easy = Math.round(20 / 100 * qcount);
                    forqcount(easy, skills[i].skillId, 1);
                    var intermediate = Math.round(30 / 100 * qcount);
                    forqcount(intermediate, skills[i].skillId, 2)
                    var hard = Math.round(50 / 100 * qcount);
                    forqcount(hard, skills[i].skillId, 3)
                  }
                   if (skills[i].cmpId == 2) {
                    var qcount = Math.round(50 / 100 * tque);
                    var easy = Math.round(50 / 100 * qcount);
                    forqcount(easy, skills[i].skillId, 1);
                    var intermediate = Math.round(30 / 100 * qcount);
                    forqcount(intermediate, skills[i].skillId, 2);
                    var hard = Math.round(20 / 100 * qcount);
                    forqcount(hard, skills[i].skillId, 3)
                  }
                   if (skills[i].cmpId==1)
                    {
                    var qcount = Math.round(50 / 100 * tque);
                    var easy = Math.round(70 / 100 * qcount);
                    forqcount(easy, skills[i].skillId, 1);
                    var intermediate = Math.round(30/100 * qcount);
                    forqcount(intermediate, skills[i].skillId, 2);
                  }
                }
              }
               if (count == 1) {
               for(let i=0;i<count;i++){
                if (skills[i].cmpId == 3) {
                  var qcount = Math.round(100 / 100 * tque);
                  var easy = Math.round(20 / 100 * qcount);
                  forqcount(easy, skills[i].skillId, 1);
                  var intermediate = Math.round(30 / 100 * qcount);
                  forqcount(intermediate, skills[i].skillId, 2);
                  var hard = Math.round(50 / 100 * qcount);
                  forqcount(hard, skills[i].skillId, 3);
                }
                 if (skills[i].cmpId == 2) {
                  var qcount = Math.round(100 / 100 * tque);
                  var easy = Math.round(20 / 100 * qcount);
                  forqcount(easy, skills[i].skillId, 1);
                  var intermediate = Math.round(60 / 100 * qcount);
                  forqcount(intermediate, skills[i].skillId, 2);
                  var hard = Math.round(20 / 100 * qcount);
                  forqcount(hard, skills[i].skillId, 3);
                }
                 if (skills[i].cmpId == 1) {
                  var qcount = Math.round(100 / 100 * tque);
                  var easy = Math.round(60 / 100 * qcount);
                  forqcount(easy, skills[i].skillId, 1);
                  var intermediate = Math.round(30 / 100 * qcount);
                  forqcount(intermediate, skills[i].skillId, 2);
                  var hard = Math.round(10 / 100 * qcount);
                  forqcount(hard, skills[i].skillId, 3);
                }
               }
              }
             
            
            }
           
              k=0;
              let result = {
                "status": "Question and Answers have been successfully inserted in AssessmentStaging"
              }
              res.status(200).json(result);
           //res.redirect('./staging/rand?assessmentId=${assessmentId}');
         }
         if(err){
           console.log(err + "3");
         }
       });
      //})
     }
     async function getAssessment()
    {
      console.log(canId,Date,starttime,candidatestatus,recId)
      await sql.open(details.connectionString, async (err, conn) => {
        await conn.query(`insert into Assessment(canId,date,startTime,assessmentstatus,recId) 
        values(${canId},'${Date}','${starttime}','${candidatestatus}',${recId}
          )`, (err, data) => {
          if (data) {
            console.log(data);
            
             getAssId(conn);
            
          }
          if (err) {
            console.log(err  + "1");
            res.send(err);
          }
        });
        if(err){
          console.log(err  + "2");
          res.send(err);
        }
      });
    }
   getAssessment();
  }
   // getAssessment();
});

module.exports = router;
