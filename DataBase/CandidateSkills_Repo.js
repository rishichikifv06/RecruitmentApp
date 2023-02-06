const { ConnectToDb, ExecuteQuery } = require("../db");

exports.addCandidateskills = async (data, dbConnection) => {
  try {
    if(data.hasOwnProperty('cmpId') && data.hasOwnProperty('skillId') && data.hasOwnProperty('canid')){
    var query = await prepareaddCanSkillsQuery(data);
    await ExecuteQuery(dbConnection, query);
   }
  } catch (err) {
    console.log("error in the CandidateSkills_Repo addCandidateskills ", err);
    throw err;
  }
};

async function prepareaddCanSkillsQuery(data) {
  try {
    const query = `INSERT into Candidateskills (cmpId,skillId,canId) values (${data.cmpId},${data.skillId}, ${data.canId})`;
    return query;
  } catch (err) {
    console.log("error in the CandidateSkills_Repo prepareCanSkillsQuery",err);
    throw err;
  }
}
