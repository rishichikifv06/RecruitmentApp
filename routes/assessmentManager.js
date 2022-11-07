var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("mssql");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.post("/",jsonParser, (req, res) => {

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
          .query(`INSERT INTO Asessment VALUES()`)
          .then(function (recordset) {
            console.log(recordset);
            const { recordset: data } = recordset;
            const jData = { data };
            res.send(jData);
            conn.close();
          })
          // Handle sql statement execution errors
          .catch(function (err) {
            console.log(err);
            res.send(err);
            conn.close();
          });
      })
      // Handle connection errors
      .catch(function (err) {
        console.log(err);
        res.send(err);
        conn.close();
      });
  }
  getData();
});



module.exports = router;