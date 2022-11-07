var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("mssql");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

//get all data
// router.get("/", (req, res) => {
//   //res.status(200).send("Home page of Questions Manager");
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
//           .query(`SELECT * FROM skills`)
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


router.get("/", (req, res) => {
    const data = {
        "data": [
            {
                "skillId": 1,
                "skillName": "C#"
            },
            {
                "skillId": 2,
                "skillName": "Angular"
            },
            {
                "skillId": 3,
                "skillName": "OOPS"
            },
            {
                "skillId": 4,
                "skillName": "React"
            }
        ]
    }

    res.json(data);
})

//get recruiter data by id
router.post("/id/", jsonParser, (req, res) => {
  const canskillid = req.body.id;
  //res.status(200).send("Home page of Questions Manager");
  function getData() {
    // Create connection instance
    var conn = new sql.ConnectionPool(details.config);
    conn
      .connect()
      // Successfull connection
      .then(function () {
        // Create request instance, passing in connection instance
        var req = new sql.Request(conn);
        // Call mssql's query method passing in params
        req
          .query(
            `select Candidateskills.canskillNameId,Candidateskills.claimedlevel,Candidate.canName,Skills.skillName FROM Candidateskills
        inner join Candidate on Candidateskills.canId = Candidate.canId left join Skills on Candidateskills.skillId=
        Skills.skillId  WHERE Candidateskills.canId= '${canskillid}'`
          )
          .then(function (recordset) {
            console.log(recordset);
            res.send(recordset);
            conn.close();
          })
          // Handle sql statement execution errors
          .catch(function (err) {
            console.log(err);
            conn.close();
          });
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
