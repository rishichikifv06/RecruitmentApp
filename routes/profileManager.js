var express = require("express");
var router = express.Router();
var sql = require("msnodesqlv8");
var details = require("../db");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.get("/", (req, res) => {
  async function getData()
  {
    await sql.open(details.connectionString, async (err, conn)=>{
    await  conn.query("SELECT * FROM Candidates",(err, data)=>{
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