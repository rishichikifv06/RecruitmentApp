const {ConnectToDb,ExecuteQuery} = require('../db');


const fetchSkills = (req,res) =>{
    try {
        async function getAllSkills() {
          await ConnectToDb()
            .then(async (dbConnection) => {
                await ExecuteQuery(dbConnection, `SELECT * FROM Skill`)
                  .then(async (result) => {
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
                    console.log(err);
                    await res.status(500).json({err});
                    await dbConnection.release();
                  });
            })
            .catch(async (err) => {
              console.log(err);
              await res.status(500).json({err});
              await dbConnection.release();
            });
        }
    
        getAllSkills();
      } catch (error) {
        console.log(error);
      }
}


const addSkillToDb = (req,res) => {

    try {
        
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
                        await res.status(200).json(status);
                        console.log(status);
                        await dbConnection.release();
                      })
                      .catch(async (err) => {
                        console.log(err);
                        await res.status(500).json(err);
                        await dbConnection.release();
                      });
                  }
                });
              }
            })
            .catch(async (err) => {
              console.log(err);
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