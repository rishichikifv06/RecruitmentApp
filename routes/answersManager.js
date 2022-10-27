var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("mssql");

router.get("/", (req, res) => {

    const complexity = req.query.complexity;
    const skillId = req.query.skillId;
    const queId = req.query.queId;
   
  //res.status(200).send("Home page of Answers Manager");
  function getData() {
    // Create connection instance
    var conn = new sql.ConnectionPool(details.config);
   
    conn.connect()
    // Successfull connection
    .then(function () {
   
      // Create request instance, passing in connection instance
      var req = new sql.Request(conn);
   
      // Call mssql's query method passing in params
      req.query(`SELECT Answer FROM Answers WHERE `)
      .then(function (recordset) {
        console.log(recordset);
        res.send(recordset);
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
