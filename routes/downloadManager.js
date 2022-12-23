var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var jsonParser = bodyParser.json();
const {ConnectToDb,ExecuteQuery} = require('../db');

router.post("/download", jsonParser, (req, res) => {

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
              if (dbConnection) {
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
                    whereClause += ` AND Candidatestatus='${status}'`;
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
                    });
                    var record = await getEachCandidate(candidateArrayData);
                    await writeDownloadFile(record);
                    // console.log(record, "record");
                    // res.status(200).json({ record });
                    res.download('../downloads/record1.csv');
                    dbConnection.release();
                  })
                  .catch((err) => {
                    logger.error(`file: ${fname},function: searchbyfilter from download api, error :${err}`);
                    res.status(500).json(err);
                    dbConnection.release();
                  });
              } else {
                console.log("Not connected to db");
              }
            })
            .catch((err) => {
              logger.error(`file: ${fname},function: searchbyfilter from download api, error :${err}`);
              res.status(500).json(err);
            });
        }
        searchByFilter();
      } catch (error) {
        logger.error(`file: ${fname},function: searchbyfilter from download api, error :${err}`);
      }
    }
    else {
      try {
        async function searchByFilter() {
          await ConnectToDb()
            .then(async (dbConnection) => {
              if (dbConnection) {
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
                    whereClause += ` AND Candidatestatus='${status}'`;
                  }
                  whereClause = whereClause.replace("noWhere AND", "where");
                  query += whereClause;
                }
                await ExecuteQuery(dbConnection, query)
                  .then(async (candidateArrayData) => {
                    console.log(query);
                    console.log(candidateArrayData);
                    await setSkillsToCandidates(
                      dbConnection,
                      candidateArrayData
                    ).then(async (result) => {
                      console.log(result, "result");
                    });
                    var record = await getEachCandidate(candidateArrayData);
                    await writeDownloadFile(record);
                    // res.status(200).json({ record });
                    logger.fatal(`file: ${fname},function: searchbyfilter from download api,staus code : 200 ,Message : "file is created "`);
                    res.download('../downloads/record1.csv');
                    dbConnection.release();
                  })
                  .catch((err) => {
                    logger.error(`file: ${fname},function: searchbyfilter from download api, error :${err}`);
                    res.status(500).json(err);
                    dbConnection.release();
                  });
              } else {
                logger.warn(`file: ${fname},function: searchbyfilter from download api,Message : "Not connected to db"`);
              }
            })
            .catch((err) => {
              logger.error(`file: ${fname},function: searchbyfilter from download api, error :${err}`);
              res.status(500).json(err);
            });
        }
        searchByFilter();
      } catch (error) {
        logger.error(`file: ${fname},function: searchbyfilter from download api, error :${err}`);
      }
    }
    async function getEachCandidate(array1) {
      for (let i = 0; i < array1.length; i++) {
        if (array1[i].status == 'closed') {
          const xday = new Date(array1[i].date);
          mmddyyyy = await formatDate(xday);
          await getScore(array1[i].canId, mmddyyyy)
            .then((score) => {
              if (score) {
                array1[i].score = score;
                //logger.info(`file: ${fname},function: geteachCandidate from download api,Message : "got score"`);
              }
              else {
                logger.info(`file: ${fname},function: geteachCandidate from download api,Message : "no score"`);
              }
            })
        }
        else {
          array1[i].score = 'assessment is pending'
        }
      }
      logger.error(`file: ${fname},function: geteachCandidate from download api, error :${err}`);
      return array1;
    }
    async function writeDownloadFile(record) {
      var output;
      jsonexport(csv1, function (err, csv) {
        if (err) return console.error(err);
        output = csv;
      })
      fs.writeFile('../downloads/record1.csv', outData, 'utf8', function (err) {
        if (err) {
            logger.info(`file: ${fname},function: writedownloadfile from download api,Message : "Some error occured - file either not saved or corrupted file saved."`);
        } else {
          logger.info(`file: ${fname},function: writedownloadfile from download api,Message : "File inserted"`);
        }
    });
    }
  });


module.exports = router;