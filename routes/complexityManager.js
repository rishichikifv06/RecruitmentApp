var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');

// const {getAllComplexities} = require("../models/queries");




router.get("/", (req, res)=>{

  try {
    
      async function getAllComplexities()
      {
       await ConnectToDb().then(async (dbConnection)=>{
        if(dbConnection){
          await ExecuteQuery(dbConnection, `SELECT * FROM Complexity`)
          .then((result)=>{
            res.status(200).json({
              Status: {
                StatusCode: 200,

                StatusType: "Success",

                StatusMessage: "Record Found",

                StatusSeverity: "Information",
              },
              result});
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
    
  } catch (error) {
    console.log(error);
  }
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


router.post("/addcmp", (req, res)=>{
  const Name = req.body.Name;
  const Skilllevel=req.body.Skilllevel;
  async function AddComplexity()
  {
    await ConnectToDb().then(async (dbConnection)=>{
      if(dbConnection){
        await ExecuteQuery(dbConnection, `insert into Complexity(Name,Skilllevel) values('${Name}','${Skilllevel}') `)
        .then((result)=>{
           if(result){
            var status ={
              "status":"success",
              "Message":"new skill is added"
            }
            res.status(200).json(status);
            console.log(status);
          dbConnection.close();
           }
        })
        .catch((err)=>{
          console.log(err);
          res.status(500).json(err);
          dbConnection.close();
        })
      }
     }).catch((err)=>{
      console.log(err);
      dbConnection.close();
     })
  }
  AddComplexity();
})

module.exports = router;