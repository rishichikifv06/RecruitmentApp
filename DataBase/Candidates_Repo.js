const { ConnectToDb, ExecuteQuery } = require("../db");

exports.addCandidate = async (data, dbConnection) => {
    try {
      console.log('add candidate')
        if(data.hasOwnProperty('canname') && data.hasOwnProperty('canphone') && data.hasOwnProperty('canexperience') && data.hasOwnProperty('emailid')){
        var addquery = await prepareCanQuery(data);
        await ExecuteQuery(dbConnection, addquery);
        }
      } catch (err) {
        console.log("error in the Candidates_Repo addCandidateskills ", err);
        throw err;
      }
}

exports.getCandidateById = async (canId,dbConnection) => {
  try{
      const query = `select * from candidates where canid = ${canId}`;
      const result = await ExecuteQuery(dbConnection, query);
      return result;
  }
  catch(err){
      console.log("error in the CandidateSkills_Repo getCandidateById ",err);
      throw err
  }
}

exports.getCandidateByEmaildb = async (data,dbConnection) => {
  try{
    if(data.hasOwnProperty('emailid')){
      const canquery = `select canid from candidates where emailid = '${data.emailid}'`;
      const result = await ExecuteQuery(dbConnection,canquery);
      const canid = result[0].canid;
      return canid;
    }
  }
  catch(err){
      console.log("error in the CandidateSkills_Repo getCandidateByNameEmail ",err);
      throw err
  }
}

exports.getCandidateByEmail = async (data) => {
  try{
    const dbConnection = await ConnectToDb();
    if(data.hasOwnProperty('EmailId')){
      const canquery = `select canid from candidates where emailid = '${data.EmailId}'`;
      
      const result = await ExecuteQuery(dbConnection,canquery);
      if(result.length > 0){
      var canid = result[0].canid;
      }
      return canid;
    }
    await dbConnection.release();
  }
  catch(err){
      console.log("error in the CandidateSkills_Repo getCandidateByNameEmail data",err);
      throw err
  }
}

async function prepareCanQuery(data) {
    try {
      const query = `INSERT INTO Candidates (canName,canPhone,canExperience,EmailId,Candidatestatus) values('${data.canname}',${data.canphone},${data.canexperience},'${data.emailid}','New')`;
      return query;
    } catch (err) {
      console.log("error in the Candidates_Repo prepareCanSkillsQuery ",err);
      throw err;
    }
}

