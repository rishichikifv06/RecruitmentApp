const {ConnectToDb,ExecuteQuery} = require('../db');
const {fileNanme,logger} = require('../log4');

var fname;

fileNanme(__filename).then((data)=>{
    fname=data;
})

const fetchComplexities = (req,res) => {
    try {
        logger.trace(`file: ${fname},getMethod getAllComplexities is called`);
        async function getAllComplexities()
        {
         await ConnectToDb().then(async (dbConnection)=>{
            await ExecuteQuery(dbConnection, `SELECT * FROM Complexity`)
            .then(async (result)=>{
                logger.info(`file: ${fname} , statuscode : 200`)
              await res.status(200).json({
                Status: {
                  StatusCode: 200,
  
                  StatusType: "Success",
  
                  StatusMessage: "Record Found",
  
                  StatusSeverity: "Information",
                },
                result});
              await dbConnection.release();
            })
            .catch(async (err)=>{
                logger.fatal(`file: ${fname},error: ${err} -1`); 
                await res.status(500).json({err});
              await dbConnection.release();
            })
         }).catch(async (err)=>{
            logger.fatal(`file: ${fname},error: ${err} -2`); 
            await res.status(500).json({err});
         })
      
        }
       
        getAllComplexities();
      
    } catch (error) {
      console.log(error);
    }
}


const addComplexityToDb = (req,res) => {
    try {
        logger.trace(`file: ${fname},postMethod AddComplexity is called`);
        const Name = req.body.Name;
        const Skilllevel=req.body.Skilllevel;
        async function AddComplexity()
        {
          await ConnectToDb().then(async (dbConnection)=>{
            if(dbConnection){
              await ExecuteQuery(dbConnection, `insert into Complexity(Name,Skilllevel) values('${Name}','${Skilllevel}') `)
              .then(async (result)=>{
                 if(result){
                    logger.info(`file: ${fname} , statuscode : 200`)
                  var status ={
                    "status":"success",
                    "Message":"new skill is added"
                  }
                  await res.status(200).json(status);
                  console.log(status);
                  await dbConnection.close();
                 }
              })
              .catch(async (err)=>{
                logger.fatal(`file: ${fname},error: ${err} -3`); 
                await res.status(500).json(err);
                await dbConnection.close();
              })
            }
           }).catch(async (err)=>{
            logger.fatal(`file: ${fname},error: ${err} -4`); 
            await res.status(500).json({err});
           })
        }
        AddComplexity();
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    fetchComplexities,
    addComplexityToDb
}