var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("mssql");
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }
  
    next();
  };

router.get("/", (req, res) => {
  const complexity = req.query.complexity;
  const skillId = req.query.skillId;
  //const queId = req.query.queId;

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
            `SELECT Question FROM quest WHERE complexity='${complexity}' AND skillId = ${skillId}`
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

router.post("/", (req, res) => {

    if(req.body != null){
        const complexity = req.body.complexity;
        const skillId = req.body.skillId;
        const Id = req.body.Id;

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
                    `SELECT TOP ${Id} Question FROM quest WHERE complexity='${complexity}' AND skillId = ${skillId}`
                  )
                  .then(function (recordset) {
                    console.log(recordset);
                    // res.send(recordset);
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
        
         res.send( getData());


    }else{
        res.send("Error");
    }
});




module.exports = router;
