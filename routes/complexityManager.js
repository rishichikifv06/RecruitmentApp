var express = require("express");
var router = express.Router();
var details = require("../db");
// var sql = require("mssql");
var sql = require("msnodesqlv8");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const {getAllComplexities} = require("../models/queries");


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


router.get("/", (req, res)=>{
  // var query = "SELECT * FROM Complexity";

  async function getData()
  {
    await sql.open(details.connectionString, async (err, conn)=>{
    await  conn.query("SELECT * FROM Complexity",(err, data)=>{
        if(data){
          console.log(data);
          const result = { data };
          res.status(200).json(result);
          conn.close();
        }
        if(err){
          console.log(err);
          res.send(err);
          conn.close();
        }
      })
      if(err){
        console.log(err);
        res.send(err);
        conn.close();
      }
    })
  }
 
  getData();
})


// router.get('/',async (req, res)=>{

//   try {
//     getAllComplexities().then((complexityData)=>{
//       console.log('eexecuted getall complexities', complexityData)
//     }).catch(()=>{
//       console.log('couldnot execute')
//     })
//     /* if(!complexityData) throw Error;
//     res.status(200).send(complexityData); */
//   } catch (error) {
//     throw error
//   }
// })


module.exports = router;