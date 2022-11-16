var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("msnodesqlv8");
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var app = express();
//const { Connection, Request } = require("tedious");
var jsonParser = bodyParser.json();
function getrandomId(number) {
  return Math.floor(Math.random() * number)
}
function toClear(array) {
  for (let z = 0; z < array.length; z++) {
    array.pop();
  }
}
var q = [];
router.post("/rand", jsonParser, (req, res) => {
  if (req.body != undefined) {
    const skills = req.body.skills;
    // const assessmentId= req.body.assessmentId;
    const canId = req.body.canId;
    var k = 0;
    var ansId;
     function getQuestions() {
      
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
              await conn.query(`Select ansId from Questions_and_Answers where queId = '${v}'`, async (err, value) => {
                
                if (value) {
                    k++;
                  ansId = value[0].ansId;
                  console.log(ansId +"answerId");
                  await conn.query(`Insert into AssessmentStaging(RowandQuestion_number,AssessmentStagingstatus,queId,
                      ansId,canId) values (${k},'open',${v},${ansId},${canId})`, (err,row) => {
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
      if (count == 3) {
        for (let i = 0; i < count; i++) {
          if (skills[i].cmpId == 3) {
            var qcount = 50 / 100 * tque;
            var easy = 20 / 100 * qcount;
            forqcount(easy, skills[i].skillId, 1);
            var intermediate = 30 / 100 * qcount;
            forqcount(intermediate, skills[i].skillId, 2)
            var hard = 50 / 100 * qcount;
            forqcount(hard, skills[i].skillId, 3)
            //console.log(qcount);
          }
          else if (skills[i].cmpId == 2) {
            var qcount = 30 / 100 * tque;
            var easy = 30 / 100 * qcount;
            forqcount(easy, skills[i].skillId, 1);
            var intermediate = 70 / 100 * qcount;
            forqcount(intermediate, skills[i].skillId, 2)
            // console.log(qcount);
          }
          else if (skills[i].cmpId == 1) {
            var qcount = 20 / 100 * tque;
            var easy = 70 / 100 * qcount;
            forqcount(easy, skills[i].skillId, 1);
            var intermediate = 30;
            forqcount(intermediate, skills[i].skillId, 2);
          }
        }
      }
      else if (count == 2) {
        for (var i = 0; i < count; i++) {
          if (skills[i].cmpId == 3) {
            var qcount = 50 / 100 * tque;
            var easy = 20 / 100 * qcount;
            forqcount(easy, skills[i].skillId, 1);
            var intermediate = 30 / 100 * qcount;
            forqcount(intermediate, skills[i].skillId, 2)
            var hard = 50 / 100 * qcount;
            forqcount(hard, skills[i].skillId, 3)
          }
          else if (skills[i].cmpId == 2) {
            var qcount = 50 / 100 * tque;
            var easy = 50 / 100 * qcount;
            forqcount(easy, skills[i].skillId, 1);
            var intermediate = 30 / 100 * qcount;
            forqcount(intermediate, skills[i].skillId, 2);
            var hard = 20 / 100 * qcount;
            forqcount(hard, skills[i].skillId, 3)
          }
          else if (skills[i].cmpId == 1) {
            var qcount = 50 / 100 * tque;
            var easy = 70 / 100 * qcount;
            forqcount(easy, skills[i].skillId, 1);
            var intermediate = 3;
            forqcount(intermediate, skills[i].skillId, 2);
          }
        }
      }
      else if (count == 1) {
        if (skills[0].cmpId == 3) {
          var qcount = 100 / 100 * tque;
          var easy = 20 / 100 * qcount;
          forqcount(easy, skills[0].skillId, 1);
          var intermediate = 30 / 100 * qcount;
          forqcount(intermediate, skills[0].skillId, 2)
          var hard = 50 / 100 * qcount;
          forqcount(hard, skills[0].skillId, 3)
        }
        else if (skills[0].cmpId == 2) {
          var qcount = 100 / 100 * tque;
          var easy = 20 / 100 * qcount;
          forqcount(easy, skills[0].skillId, 1);
          var intermediate = 60 / 100 * qcount;
          forqcount(intermediate, skills[0].skillId, 2);
          var hard = 20 / 100 * qcount;
          forqcount(hard, skills[0].skillId, 3)
        }
        else if (skills[0].cmpId == 1) {
          var qcount = 100 / 100 * tque;
          var easy = 60 / 100 * qcount;
          forqcount(easy, skills[0].skillId, 1);
          var intermediate = 30 / 100 * qcount;
          forqcount(intermediate, skills[0].skillId, 2);
          var hard = 10 / 100 * qcount;
          forqcount(hard, skills[0].skillId, 3);
        }
      }
    }
    getQuestions();
    k=0;
    // res.send("success");
  }
  else {
    res.send("err");
  }
});
router.post("/allQA", jsonParser, (req, res) => {
  if (req.body != undefined) {
    const cmpId = req.body.compId;
    const skillId = req.body.skillId;
    async function getData() {
      await sql.open(details.connectionString, async (err, conn) => {
        await conn.query(`SELECT Question, Answer FROM QandA WHERE cmpId=${cmpId} AND skillId =${skillId}`, (err, data) => {
          if (data) {
            console.log(data);
            const result = { data };
            res.status(200).json(result);
          }
          if (err) {
            console.log(err);
            res.send(err);
          }
        })
        if (err) {
          console.log(err);
          res.send(err);
        }
      })
    }
    getData();
  }
})
module.exports = router;













