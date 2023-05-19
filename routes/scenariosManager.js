var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');
const queries = {
    insrtAnsExplanation:`insert into ansexplanation(counter, fldname, fldvalue, ansid) values(?,?,?,?)`
}
router.post("/scenarios",async (req,res)=>{
    console.log('query params  ------ ',req.query)
        try {
            const ansid = req.query.ansid
            await ConnectToDb()
            .then(async(dbConn)=>{
                await ExecuteQuery(dbConn,queries.insrtAnsExplanation,1,'Scenario','insert from BkEND test 1','value 1',3103)
                .then((resultant)=>{
                    console.log('insertion done -----------',resultant)
                }).catch(err=>{
                    console.log(err + 'Insert into ansexplanation failed')
                })
            })
            .catch((err) => {
                console.log(err + 'Connecting to DB error for scenarios api');
              });
        } catch (error) {
          console.log(error,"from uploadQA")
        }
      
})

module.exports = router;
