const {ConnectToDb,ExecuteQuery} = require('../db');
const {fileNanme,logger} = require('../log4');

var fname;

fileNanme(__filename).then((data)=>{
    fname=data;
})

async function setSkillsToCandidates(dbConnection, candidateArrayData) {
  var id;
  for (let i = 0; i < candidateArrayData.length; i++) {
    id = candidateArrayData[i].InterviewId;

    await ExecuteQuery(
      dbConnection,
      `select Skill.skillName,Complexity.Name,Complexity.skilllevel,Skill.skillId,Complexity.cmpId from InterviewSkills 
         left join Skill on Skill.skillId=InterviewSkills.skillId 
         left join Complexity on Complexity.cmpId =InterviewSkills.cmpId 
         where InterviewSkills.InterviewId = ${id}`
    )
      .then((candidateSkills) => {
        candidateArrayData[i].skills = candidateSkills;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return candidateArrayData;
}

const interviewFilter = (req, res) => {

  logger.trace(`file: ${fname},postMethod searchByFilter is called`);

  const emailId = req.body.emailId;
  console.log(emailId);
  const name = req.body.name;
  const status = req.body.status;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  if (startDate && endDate) {
    try {
      async function searchByFilter() {
        await ConnectToDb()
          .then(async (dbConnection) => {
            let query = `select CandidateInterview.date, CandidateInterview.InterviewId, CandidateInterview.status ,Candidates.canId, Candidates.canName, Candidates.EmailId, Candidates.canPhone
                  ,Candidates.canExperience from CandidateInterview 
                  left join Candidates on Candidates.canId=CandidateInterview.canId 
                  where CandidateInterview.date between '${startDate}' and '${endDate}'`;
            let whereClause = "noWhere";

            if (
              emailId === undefined &&
              name === undefined &&
              status === undefined &&
              startDate === undefined &&
              endDate === undefined
            ) {
              query = `select CandidateInterview.date, CandidateInterview.InterviewId, CandidateInterview.status ,Candidates.canId, Candidates.canName, Candidates.EmailId, Candidates.canPhone
                    ,Candidates.canExperience from CandidateInterview 
                    left join Candidates on Candidates.canId=CandidateInterview.canId 
                    where CandidateInterview.status='Open'`;
            } else {
              if (emailId) {
                whereClause += ` AND EmailId like '${emailId}%'`;
              }
              if (name) {
                whereClause += ` AND canName like '%${name}%'`;
              }
              if (status) {
                whereClause += ` AND CandidateInterview.status='${status}'`;
              }
              whereClause = whereClause.replace("noWhere", "");
              query += whereClause;
            }

            await ExecuteQuery(dbConnection, query)
              .then(async (candidateArrayData) => {
                console.log(query);
                await setSkillsToCandidates(
                  dbConnection,
                  candidateArrayData
                ).then(async (result) => {
                    logger.info(`file: ${fname} , statuscode : 200`);

                  await res.status(200).json({
                    Status: {
                      StatusCode: 200,

                      StatusType: "Success",

                      StatusMessage: "Record Found",

                      StatusSeverity: "Information",
                    },
                    result,
                  });
                  await dbConnection.release();
                });
              })
              .catch(async (err) => {
                logger.fatal(`file: ${fname},error: ${err} -1`); 
                await res.status(500).json({ err });
                await dbConnection.release();
              });
          })
          .catch(async (err) => {
            logger.fatal(`file: ${fname},error: ${err} -2`); 
            await res.status(500).json({ err });
            await dbConnection.release();
          });
      }
      searchByFilter();
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
        logger.trace(`file: ${fname},postMethod searchByFilter is called -1`);
      async function searchByFilter() {
        await ConnectToDb()
          .then(async (dbConnection) => {
            let query = `select CandidateInterview.date, CandidateInterview.InterviewId, CandidateInterview.status ,Candidates.canId, Candidates.canName, Candidates.EmailId, Candidates.canPhone
                 ,Candidates.canExperience from CandidateInterview 
                 left join Candidates on Candidates.canId=CandidateInterview.canId `;
            let whereClause = "noWhere";

            if (
              emailId === undefined &&
              name === undefined &&
              status === undefined
            ) {
              query = `select CandidateInterview.date, CandidateInterview.InterviewId, CandidateInterview.status ,Candidates.canId, Candidates.canName, Candidates.EmailId, Candidates.canPhone
                   ,Candidates.canExperience from CandidateInterview 
                   left join Candidates on Candidates.canId=CandidateInterview.canId 
                   where CandidateInterview.status='Open'`;
            } else {
              if (emailId) {
                whereClause += ` AND EmailId like '${emailId}%'`;
              }
              if (name) {
                whereClause += ` AND canName like '%${name}%'`;
              }
              if (status) {
                whereClause += ` AND CandidateInterview.status='${status}'`;
              }
              whereClause = whereClause.replace("noWhere AND", "where");
              query += whereClause;
            }

            await ExecuteQuery(dbConnection, query)
              .then(async (candidateArrayData) => {
                console.log(query);
                await setSkillsToCandidates(
                  dbConnection,
                  candidateArrayData
                ).then(async (result) => {
                    logger.info(`file: ${fname} , statuscode : 200 -1`);

                  await res.status(200).json({
                    Status: {
                      StatusCode: 200,

                      StatusType: "Success",

                      StatusMessage: "Record Found",

                      StatusSeverity: "Information",
                    },
                    result,
                  });
                  await dbConnection.release();
                });
              })
              .catch(async (err) => {
                logger.fatal(`file: ${fname},error: ${err} -3`); 
                await res.status(500).json({ err });
                await dbConnection.release();
              });
          })
          .catch(async (err) => {
            logger.fatal(`file: ${fname},error: ${err} -4`); 
            await res.status(500).json({ err });
            await dbConnection.release();
          });
      }
      searchByFilter();
    } catch (error) {
      console.log(error);
    }
  }
};


module.exports = {
    interviewFilter
}