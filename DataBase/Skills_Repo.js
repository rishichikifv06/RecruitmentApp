const { ConnectToDb, ExecuteQuery } = require("../db");

exports.getSkillIdBySkill = async (skillName) => {
  try {
    var skillid;
    await ConnectToDb()
      .then(async (dbConnection) => {
        await ExecuteQuery(
          dbConnection,
          `select skillid from Skill where skillname='${skillName}'`
        )
          .then((value) => {
            if (value.length !== 0) {
              skillid = value[0].skillid;
            }
            dbConnection.release();
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return skillid;
  } catch (err) {
    console.log("error in the Skills_Repo getSkillIdBySkill ", err);
    throw err;
  } 
};
