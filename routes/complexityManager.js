var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');

const {getAllComplexities} = require("../models/queries");




router.get("/", (req, res)=>{

  async function getAllComplexities()
  {
   await ConnectToDb().then(async (dbConnection)=>{
    if(dbConnection){
      await ExecuteQuery(dbConnection, `SELECT * FROM Complexity`)
      .then((result)=>{
        res.status(200).json({result});
        dbConnection.close();
      })
      .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
        dbConnection.close();
      })
    }
    else{
      console.log("Not connected to db");
    }
   }).catch((err)=>{
    console.log(err);
    dbConnection.close();
   })

  }
 
  getAllComplexities();
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