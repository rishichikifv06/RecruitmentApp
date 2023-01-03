const { ConnectToDb, ExecuteQuery } = require("../db");
const {fileNanme,logger} = require('../log4');

var fname;

fileNanme(__filename).then((data)=>{
    fname=data;
})

const createCandidate = (req, res) => {
  try {
    logger.trace(`file: ${fname},postMethod toCreateCandidateProfile is called`);

    const emailId = req.body.emailId;
    const name = req.body.name;
    const phone = req.body.phone;
    const experience = req.body.experience;
    const skills = req.body.skills;

    async function toCreateCandidateProfile() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          if (dbConnection) {
            await ExecuteQuery(
              dbConnection,
              `INSERT INTO Candidates (canName,canPhone,canExperience,EmailId,Candidatestatus) values( '${name}',${phone},${experience},'${emailId}','New')`
            )
              .then(async (insertedCandidateData) => {
                if (insertedCandidateData) {
                  console.log(insertedCandidateData);
                  await ExecuteQuery(
                    dbConnection,
                    `SELECT canId from Candidates where canName= '${name}' and canPhone= ${phone} and canExperience=${experience} and
                  EmailId = '${emailId}'`
                  ).then(async (candidateData) => {
                    if (candidateData) {
                      const [{ canid }] = candidateData;

                      await toInsertSkillsForCandidate(canId, dbConnection)
                        .catch((err) => {
                          console.log(err);
                          res.send(err);
                          dbConnection.release();
                        })
                        .then(async (insertedSkillsData) => {
                          if (insertedSkillsData) {
                            var success = {
                              StatusCode: 200,
                              StatusType: "Success",
                              StatusMessage: `Profile created successfully for ${canid}`,
                              StatusSeverity: "Information updated",
                            };
                            logger.info(`file: ${fname} , statuscode : 200`)
                            await res.status(200).json(success);
                            await dbConnection.release();
                          } else {
                            res.status(500).send("Profile creation failed!!!");
                            dbConnection.release();
                          }
                        })
                        .catch(async (err) => {
                          logger.fatal(`file: ${fname},error: ${err} -1`); 
                          await res.status(500).json({ err });
                          await dbConnection.release();
                        });
                    } else {
                      console.log("Candidates Data not selected!!!");
                      dbConnection.release();
                    }
                  });
                } else {
                  console.log("Candidates data is not inserted!!!");
                  dbConnection.release();
                }
              })
              .catch(async (err) => {
                logger.fatal(`file: ${fname},error: ${err} -2`); 
                await res.status(500).json({ err });
                await dbConnection.release();
              });
          } else {
            console.log("Not connected to db");
          }
        })
        .catch(async (err) => {
            logger.fatal(`file: ${fname},error: ${err} -3`); 
            await res.status(500).json({ err });
        });
    }
    toCreateCandidateProfile();

    async function toInsertSkillsForCandidate(canId, dbConnection) {
      let count = 0;
      for (let i = 0; i < skills.length; i++) {
        await ExecuteQuery(
          dbConnection,
          `INSERT into Candidateskills (cmpId,skillId,canId) values (${skills[i].cmpId},${skills[i].skillId}, ${canId})`
        ).then((insertedCandidateSkillsData) => {
          if (insertedCandidateSkillsData) {
            count++;
          }
        });
      }
      if (count > 0) {
        return "Skills for Candidate is inserted!!!";
      }
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchCandidateSkillAndAssessment = (req, res) => {
  try {
    logger.trace(`file: ${fname},postMethod getCandidateSkillsandAssessment is called`);

    const emailId = req.body.emailId;

    async function getCandidateSkillsandAssessment() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          await ExecuteQuery(
            dbConnection,
            `select * from Candidates  where EmailId='${emailId}'`
          )
            .then(async (candidatesData) => {
              console.log(candidatesData);
              if (candidatesData.length != 0) {
                const canId = candidatesData[0].canid;
                console.log("candidateId ", canId);

                await ExecuteQuery(
                  dbConnection,
                  `select Skill.skillName,Complexity.Skilllevel,CandidateSkills.canskillId from CandidateSkills 
                left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity on Complexity.cmpId=CandidateSkills.cmpId
                where canId=${canId}`
                )
                  .then(async (skillData) => {
                    candidatesData[0].skills = skillData;

                    await ExecuteQuery(
                      dbConnection,
                      `select * from Assessment where canId=${canId}`
                    )
                      .then(async (assessmentData) => {
                        var flag = 0;
                        for (let i = 0; i < assessmentData.length; i++) {
                          if (assessmentData[i].assessmentstatus === "Open") {
                            flag = 1;
                          }
                        }
                        if (flag == 0) {
                          candidatesData[0].assessmentsStatus = "Open";
                        } else {
                          candidatesData[0].assessmentsStatus = "notOpen";
                        }
                        candidatesData[0].assessments = assessmentData;
                      })
                      .then(() => {
                        logger.info(`file: ${fname} , statuscode : 200`)
                        res.status(200).json({
                          Status: {
                            StatusCode: 200,

                            StatusType: "Success",

                            StatusMessage: "Record Found",

                            StatusSeverity: "Information",
                          },
                          candidatesData,
                        });
                      })
                      .catch((err) => {
                        logger.fatal(`file: ${fname},error: ${err} -1`); 
                        dbConnection.release();
                        res.status(500).json({ err });
                      });
                  })
                  .catch((err) => {
                    logger.fatal(`file: ${fname},error: ${err} -2`); 
                    dbConnection.release();
                    res.status(500).json({ err });
                  });
              } else if (candidatesData.length == 0) {
                res.status(404).json({
                  Status: {
                    StatusCode: 404,

                    StatusType: "Failed",

                    StatusMessage: "No Record Found",

                    StatusSeverity: "Information not Found",
                  },
                });
              }
            })
            .catch((err) => {
                logger.fatal(`file: ${fname},error: ${err} -3`); 
              dbConnection.release();
              res.status(500).json({ err });
            });
        })
        .catch((err) => {
            logger.fatal(`file: ${fname},error: ${err} -4`); 
            res.status(500).json({ err });
        });
    }
    getCandidateSkillsandAssessment();
  } catch (error) {
    console.log(error);
  }
};

const statusUpdateCandidate = (req, res) => {
  try {
    logger.trace(`file: ${fname},postMethod updateCandidateData is called`);

    const data = req.body.data; //array structure
    const skills = data[0].skills;
    const canId = data[0].canId;
    console.log(canId);
    async function updateCandidateData() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          if (dbConnection) {
            await ExecuteQuery(
              dbConnection,
              `update Candidates set canExperience=${data[0].canExperience},Candidatestatus='${data[0].Candidatestatus}'`
            )
              .then(async (updatedCandidateData) => {
                if (updatedCandidateData) {
                  await toInsertCandidateSkills(dbConnection)
                    .then((responseData) => {
                      if (responseData) {
                        const result = {
                          StatusCode: 200,
                          StatusType: "success",
                          StatusMessage: "candidate data updated successfully ",
                          StatusSeverity: "Information updated",
                        };
                        logger.info(`file: ${fname} , statuscode : 200`)
                        res.status(200).json(result);
                        dbConnection.release();
                      }
                    })
                    .catch((err) => {
                        logger.fatal(`file: ${fname},error: ${err} -5`); 
                        res.status(500).json(err);
                      dbConnection.release();
                    });
                } else {
                  console.log("Candidate data not updated!!!");
                  dbConnection.release();
                }
              })
              .catch((err) => {
                logger.fatal(`file: ${fname},error: ${err} -6`); 
                res.status(500).json(err);
                dbConnection.release();
              });
          } else {
            console.log("Not connected to db");
          }
        })
        .catch((err) => {
            logger.fatal(`file: ${fname},error: ${err} -7`); 
            res.status(500).json(err);
        });
    }
    updateCandidateData();
    async function toInsertCandidateSkills(dbConnection) {
      let count = 0;
      for (let i = 0; i < skills.length; i++) {
        if (skills[i].canskillId) {
          await ExecuteQuery(
            dbConnection,
            `update CandidatSkills set cmpId=${skills[i].cmpId} where canskillId = ${skills[i].canskillId}`
          )
            .then((value) => {
              if (value.length == 1) {
                console.log("updating candidate skills is done !!!");
                count++;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          await ExecuteQuery(
            dbConnection,
            `insert into CandidateSkills(cmpId,skillId,canId) values(${skills[i].cmpId},${skills[i].skillId},
                ${canId})`
          )
            .then((insertedCansdidateSkillsData) => {
              if (insertedCansdidateSkillsData.length == 1) {
                console.log("inserting candidate skills is done !!!");
                count++;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
      if (count == skills.length) {
        return skills;
      } else return null;
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchCandidateSkills = (req, res) => {
  try {
    logger.trace(`file: ${fname},postMethod getcandidateSkills is called`);
    const canId = req.body.canId;
    async function getcandidateSkills() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          if (dbConnection) {
            await ExecuteQuery(
              dbConnection,
              `select CandidateSkills.skillId,CandidateSkills.cmpId,Skill.skillName,Complexity.Name from CandidateSkills
               left join Skill on Skill.skillId=CandidateSkills.skillId
               left join Complexity on Complexity.cmpId = CandidateSkills.cmpId  where canId=${canId}`
            )
              .then((data) => {
                if (data) {
                    logger.info(`file: ${fname} , statuscode : 200`)
                  res.status(200).json({ data });
                  dbConnection.release();
                }
              })
              .catch((err) => {
                logger.fatal(`file: ${fname},error: ${err} -8`); 
                res.status(500).json({ err });
                dbConnection.release();
              });
          }
        })
        .catch((err) => {
            logger.fatal(`file: ${fname},error: ${err} -9`); 
            res.status(500).json({ err });
        });
    }
    getcandidateSkills();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createCandidate,
  fetchCandidateSkillAndAssessment,
  statusUpdateCandidate,
  fetchCandidateSkills
};
