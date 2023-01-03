const {ConnectToDb,ExecuteQuery} = require('../db');
const {fileNanme,logger} = require('../log4');

var fname;

fileNanme(__filename).then((data)=>{
    fname=data;
})

const fetchSkills = (req,res) =>{
    try {
        logger.trace(`file: ${fname},getMethod getAllSkills is called`);
        async function getAllSkills() {
          await ConnectToDb()
            .then(async (dbConnection) => {
                await ExecuteQuery(dbConnection, `SELECT * FROM Skill`)
                  .then(async (result) => {
                    logger.info(`file: ${fname} , statuscode : 200`)
                     await res.status(200).json({
                      Status: {
                        StatusCode: 200,
    
                        StatusType: "Success",
    
                        StatusMessage: "Record Found",
    
                        StatusSeverity: "Information",
                      },
                      result
                    });
                   await dbConnection.release();
                  })
                  .catch(async (err) => {
                    logger.fatal(`file: ${fname},error: ${err} -1`); 
                    await res.status(500).json({err});
                    await dbConnection.release();
                  });
            })
            .catch(async (err) => {
              logger.fatal(`file: ${fname},error: ${err} -2`);
              await res.status(500).json({err});
              await dbConnection.release();
            });
        }
    
        getAllSkills();
      } catch (error) {
        logger.fatal(`file: ${fname},error: ${err} -3`);
      }
}


const addSkillToDb = (req,res) => {

    try {
        logger.trace(`file: ${fname},postMethod addSkill is called`);
        
        const skillName = req.body.skillName;
        async function AddSkill() {
          await ConnectToDb()
            .then(async (dbConnection) => {
              if (dbConnection) {
                await ExecuteQuery(
                  dbConnection,
                  `select skillName from Skill where skillName='${skillName}'`
                ).then(async (selectedSkill) => {
                  if (selectedSkill.length != 0) {
                    console.log(selectedSkill);
                    var status = {
                      Message: "The skill is already present!!",
                    };
                    logger.info(`file: ${fname} , statuscode : 200`)
                    await res.status(200).json(status);
                    await dbConnection.release();
                  } else {
                    await ExecuteQuery(
                      dbConnection,
                      `insert into Skill(skillName) values('${skillName}') `
                    )
                      .then(async (result) => {
                        var status = {
                          status: "success",
                          Message: `${skillName} added successfully!!`,
                        };
                        logger.info(`file: ${fname} , statuscode : 200`);
                        await res.status(200).json(status);
                        console.log(status);
                        await dbConnection.release();
                      })
                      .catch(async (err) => {
                        logger.fatal(`file: ${fname},error: ${err} -4`); 
                        await res.status(500).json(err);
                        await dbConnection.release();
                      });
                  }
                });
              }
            })
            .catch(async (err) => {
                logger.fatal(`file: ${fname},error: ${err} -5`); 
                await dbConnection.release();
            });
        }
        AddSkill();
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    fetchSkills,
    addSkillToDb
}