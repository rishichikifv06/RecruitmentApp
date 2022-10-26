var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("mssql");
//const { Connection, Request } = require("tedious");


var data = [
  {
    question: "qustion1",
    answer: "answer1",
  },
];

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
    req.query("SELECT TOP 10 * FROM QueandAns")
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
