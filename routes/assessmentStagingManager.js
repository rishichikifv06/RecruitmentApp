var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("mssql");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();



   
    function getData(qId, aId) {
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
            .query(`INSERT INTO AsessmentStaging VALUES()`)
            .then(function (recordset) {
              console.log(recordset);
              const { recordset: data } = recordset;
              const jData = { data };
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

    // if(data.length != 0){
    //     for(var i=0; i<data.length; i++){
    //         getData(data[i].qId, data[i].aId);
    //     }
    // }
 
    router.post("/", jsonParser, (req, res) => {

        if(req.body != undefined){
            const id = req.body.id;
            const compId = req.body.compId;
            const skillId = req.body.skillId;
      
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
                        `SELECT Question, Answer, queansId FROM AssessmentStaging WHERE compId=${compId} AND skillId =${skillId}`
                      )
                      .then(function (recordset) {
                        console.log(recordset);
                        const{recordset: data} = recordset;
                         res.send(( data[id]));
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
      
      
        }else{
            res.send("Error");
        }
      });

  module.exports = router;