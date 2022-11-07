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
//           .query(`SELECT * FROM Complexity`)
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
    //res.status(200).send("Home page of Questions Manager");
    const data = {
        "data": [
            {
                "Id": 1,
                "Name": "Easy"
            },
            {
                "Id": 2,
                "Name": "Medium"
            },
            {
                "Id": 3,
                "Name": "Hard"
            }
        ]
    }

    res.json(data);

  });


module.exports = router;