const {ConnectToDb, ExecuteQuery} = require("../db");

module.exports.getAllComplexities = async() =>{

     return ConnectToDb().then(async (dbConnection)=>{

       
         if(!dbConnection) console.log("Not connected to db");
         else{
            console.log("connected")
            return ExecuteQuery(dbConnection , `SELECT * FROM Complexity`);
            
         }
     }).catch((err)=>{
        console.log(err)
     })
}