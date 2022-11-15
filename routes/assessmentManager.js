var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("mssql");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.post("/",jsonParser, (req, res) => {

  async function getData()
  {
    await sql.open(details.connectionString, async (err, conn)=>{
    await  conn.query("SELECT * FROM Complexity",(err, data)=>{
        if(data){
          console.log(data);
          const result = { data };
          res.status(200).json(result);
        }
        if(err){
          console.log(err);
          res.send(err);
        }
      })
      if(err){
        console.log(err);
        res.send(err);
      }
    })
  }
 
  getData();
});



module.exports = router;