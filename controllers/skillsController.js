const {ConnectToDb,ExecuteQuery} = require('../db');


const fetchSkills = (req,res) =>{
    try {
        async function getAllSkills() {
          await ConnectToDb()
            .then(async (dbConnection) => {
                await ExecuteQuery(dbConnection, `SELECT * FROM Skill`)
                  .then((result) => {
                    res.status(200).json({
                      Status: {
                        StatusCode: 200,
    
                        StatusType: "Success",
    
                        StatusMessage: "Record Found",
    
                        StatusSeverity: "Information",
                      },
                      result,
                    });
                    dbConnection.release();
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({err});
                    dbConnection.release();
                  });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({err});
              dbConnection.release();
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
                    res.status(200).json(status);
                    dbConnection.release();
                  } else {
                    await ExecuteQuery(
                      dbConnection,
                      `insert into Skill(skillName) values('${skillName}') `
                    )
                      .then((result) => {
                        var status = {
                          status: "success",
                          Message: `${skillName} added successfully!!`,
                        };
                        res.status(200).json(status);
                        console.log(status);
                        dbConnection.release();
                      })
                      .catch((err) => {
                        console.log(err);
                        res.status(500).json(err);
                        dbConnection.release();
                      });
                  }
                });
              }
            })
            .catch((err) => {
              console.log(err);
              dbConnection.release();
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