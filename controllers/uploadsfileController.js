const { ConnectToDb, ExecuteQuery } = require("../db");
const { fileNanme, logger } = require("../log4");
var path = require("path");
const csv = require("csv-parser");
const fs = require("fs");

var fname;

fileNanme(__filename).then((data) => {
  fname = data;
});

const skillsUpload = (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  sampleFile = req.files.file;
  console.log(sampleFile);
  uploadPath = path.join(__dirname, "..", "downloads", sampleFile.name);
  console.log(uploadPath);

  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  var skillName;
  var count = 0;
  var jsonObjCount = 0;

  async function readcsvFile() {
    var jsonArray = [];
    fs.createReadStream(uploadPath)
      .pipe(csv({}))
      .on("data", (data) => jsonArray.push(data))
      .on("end", async () => {
        var errorArray = [];
        for (let i = 0; i < jsonArray.length; i++) {
          if (Object.keys(jsonArray[i]).length != 1) {
            const errorObj = {
              LineNum: i + 1,
              Error: `More or Less fields than required!!`,
            };
            errorArray.push(errorObj);
            jsonObjCount++;
          } else if (jsonArray[i][Object.keys(jsonArray[i])[0]] === 0) {
            const errorObj = {
              LineNum: i + 1,
              Error: `SkillName should not be empty!!`,
            };
            errorArray.push(errorObj);
            jsonObjCount++;
          }
        }
        if (jsonObjCount > 0) {
          var statusMessage = {
            statusCode: 200,
            status: "Failed",
            message: `${jsonObjCount} rows are not valid. Please check error file for more details`,
          };
          console.log("Invalid rows found");

          console.log('line 67' + errorArray.length)
          if (errorArray.length > 0) {
            const extension = path.extname(uploadPath);
            const filename = path.basename(uploadPath, extension);
            const errorString = JSON.stringify(errorArray, null, "\t");
            const errFileName = path.join(__dirname,"..","ErrorFiles","Error_" + filename + ".json");
            fs.writeFile(errFileName,errorString,(err) => err && console.error(err));
            
            fs.unlink(uploadPath, (err) => {
              if (err){
                res.status(500).json({err})
              };
              return res.status(200).json(statusMessage);
            });
          }
          //return res.status(200).json(statusMessage);
        } else {
          await uploadfile(jsonArray);
        }
      })
      .on("error", (err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
  async function uploadfile(ipJsonArray) {
    await ConnectToDb()
      .then(async (dbConnection) => {
        for (let i = 0; i < ipJsonArray.length; i++) {
          skillName = ipJsonArray[i].SkillName;
          if (skillName != undefined) {
            dbConnection.query("BEGIN");
            await ExecuteQuery(
              dbConnection,
              `insert into Skill(skillName) values('${skillName}')`
            )
              .then(async () => {
                count++;
              })
              .catch((err) => {
                dbConnection.query("ROLLBACK");
                console.log(err);
                res.status(500).json({ err });
              });
          }
        }
        if (count == ipJsonArray.length) {
          var status = {
            status: "success",
            message: "File Processed Successfully",
          };
          dbConnection.query("COMMIT");
          dbConnection.release();
          return res.status(200).json(status);
        } else {
          console.log(`count ${count}`);
          var statusMessage = {
            status: "Failed",
            message: "Could not process file!!!",
          };
          dbConnection.release();
          return res.status(500).json(statusMessage);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err });
      });
  }

  readcsvFile();
});
};

const profileUpload = (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  sampleFile = req.files.file;
  console.log(sampleFile);
  uploadPath = path.join(__dirname, "..", "downloads", sampleFile.name);
  console.log(uploadPath);

  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    
  console.log('line 162')
  console.log(fs.existsSync(uploadPath))

  var jsonObjCount = 0;
  try {
    async function readcsvFile() {
      var jsonArray = [];
      fs.createReadStream(uploadPath)
        .pipe(csv({}))
        .on("data", (data) => jsonArray.push(data))
        .on("end", async () => {
          var errorArray = [];
          for (let i = 0; i < jsonArray.length; i++) {
            const skill = await getSkillIdbyName(jsonArray[i].Skill);
            const complexityid = await getcmpIdbyName(jsonArray[i].Complexity);

            //check if rows are empty and has valid skilllevel and complexity
            if (Object.keys(jsonArray[i]).length != 6) {
              const errorObj = {
                LineNum: i + 1,
                Error: `More or Less fields than required!!`,
              };
              errorArray.push(errorObj);
              jsonObjCount++;
            } else if (
              jsonArray[i].canName.length === 0 ||
              jsonArray[i].canPhone.length === 0 ||
              jsonArray[i].canExperience.length === 0 ||
              jsonArray[i].EmailId.length === 0 ||
              jsonArray[i].Skill.length === 0 ||
              jsonArray[i].Complexity.length === 0
            ) {
              const errorObj = {
                LineNum: i + 1,
                Error: `Please Enter All the fields!!`,
              };
              errorArray.push(errorObj);
              jsonObjCount++;
            } else if (skill == undefined || complexityid == undefined) {
              const errorObj = {
                LineNum: i + 1,
                Error: `Please enter valid Skill or Complexity!!`,
              };
              errorArray.push(errorObj);
              jsonObjCount++;
            }
          }
          if (jsonObjCount > 0) {
            var statusMessage = {
              status: "Failed",
              message: `${jsonObjCount} rows are not valid. Please check error file for more details`,
            };
            console.log("Invalid rows found");

            if (errorArray.length > 0) {
              const extension = path.extname(uploadPath);
              const filename = path.basename(uploadPath, extension);
              const errorString = JSON.stringify(errorArray, null, "\t");
              const errFileName = path.join(__dirname,"..","ErrorFiles","Error_" + filename + ".json");
              fs.writeFile(errFileName,errorString,(err) => err && console.error(err));
              
              fs.unlink(uploadPath, (err) => {
                if (err){
                  res.status(500).json({err})
                };
                return res.status(200).json(statusMessage);
              });
            }
            //return res.status(200).json(statusMessage);
          } else {
            //prepare JsonArray for particular candidate and create reecords using function
            var skillsArray = [];

            for (let i = 0; i < jsonArray.length; i++) {
              var skillsObj = {};
              const skillId = await getSkillIdbyName(jsonArray[i].Skill);
              const cmpId = await getcmpIdbyName(jsonArray[i].Complexity);

              skillsObj = {
                skillId: skillId,
                cmpId: cmpId,
              };

              if (i >= 1) {
                var lastCandidate = jsonArray[i - 1].canName;
              }
              if (lastCandidate != jsonArray[i].canName) {
                skillsArray = [];
                var payLoadProfile = {
                  canName: jsonArray[i].canName,
                  canPhone: jsonArray[i].canPhone,
                  canExperience: jsonArray[i].canExperience,
                  EmailId: jsonArray[i].EmailId,
                };
                skillsArray.push(skillsObj);
                payLoadProfile["skills"] = skillsArray;
              } else {
                skillsArray.push(skillsObj);
                payLoadProfile.skills = skillsArray;
              }

              //if it's a last record
              if (i === jsonArray.length - 1) {
                console.log("candidateobj");
                console.log(payLoadProfile);
               
                const data = await uploadProfile(payLoadProfile);
               
                if (!data.status) {
                  const statusMessage = {
                    status: "Failed",
                    message: "Failed to prcoess the File",
                  };
                  res.status(500).json(statusMessage);
                }
              } else if (i !== jsonArray.length) {
                // if it's last record of particular candidate
                if (jsonArray[i].canName != jsonArray[i + 1].canName) {
                  console.log("last candidateobj");
                  console.log(payLoadProfile);

                  const data = await uploadProfile(payLoadProfile);

                  if (!data.status) {
                    const statusMessage = {
                      status: "Failed",
                      message: "Failed to prcoess the File",
                    };
                    res.status(500).json(statusMessage);
                  }
                }
              }
            }
            var statusMessage = {
              status: "Success",
              message: "Profiles created successfully",
            };
            res.status(200).json(statusMessage);
          }
        })
        .on("error", (err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    }
    async function uploadProfile(ipObj) {
     
      const emailId = ipObj.EmailId;
      const name = ipObj.canName;
      const phone = ipObj.canPhone;
      const experience = ipObj.canExperience;
      const skills = ipObj.skills;
      var data = {};

      async function toCreateCandidateProfile() {
        await ConnectToDb()
          .then(async (dbConnection) => {
            await ExecuteQuery(dbConnection, "BEGIN");
            await ExecuteQuery(
              dbConnection,
              `INSERT INTO Candidates (canName,canPhone,canExperience,EmailId,Candidatestatus) values( '${name}',${phone},${experience},'${emailId}','New')`
            )
              .then(async (result) => {
                  await ExecuteQuery(
                    dbConnection,
                    `SELECT canId from Candidates where canName= '${name}' and canPhone= ${phone} and canExperience=${experience} and
                  EmailId = '${emailId}'`
                  ).then(async (candidateData) => {
                    if (candidateData) {
                      const [{ canid }] = candidateData;
                      await toInsertSkillsForCandidate(canid, dbConnection)
                        .then(async (insertedSkillsData) => {
                          if (insertedSkillsData) {
                            await dbConnection.query("COMMIT");
                            await dbConnection.release();
                            data.status = true;
                            return data;
                          } else {
                            dbConnection.query("ROLLBACK");
                            data.status = false;
                            //res.status(500).send("Could not create !!!");
                            dbConnection.release();
                          }
                        })
                        .catch(async (err) => {
                          dbConnection.query("ROLLBACK");
                          await res.status(500).json({err});
                          await dbConnection.release();
                        });
                    } else {
                      data.status = false;
                      dbConnection.query("ROLLBACK");
                      dbConnection.release();
                    }
                  });
              })
              .catch(async (err) => {
                await res.status(500).json({err});
                await dbConnection.release();
              });
          })
          .catch(async (err) => {
            await res.status(500).json({ Error: err });
          });
      }
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
        if (count == skills.length) {
          return "Skills for Candidate is inserted!!!";
        }
        return null;
      }
      await toCreateCandidateProfile();
      return data;
    }
    readcsvFile();
  } catch (err) {
    res.status(500).json({ err });
  } 
  });
};

const qnaUpload = (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  sampleFile = req.files.file;
  console.log(sampleFile);
  uploadPath = path.join(__dirname, "..", "downloads", sampleFile.name);
  console.log(uploadPath);

  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  var queId;
  var ansId;
  var count = 0;
  var jsonObjCount = 0;

  async function readcsvFile() {
    var jsonArray = [];
    fs.createReadStream(uploadPath)
      .pipe(csv({}))
      .on("data", (data) => jsonArray.push(data))
      .on("end", async () => {
        console.log(jsonArray);
        var errorArray = [];
        for (let i = 0; i < jsonArray.length; i++) {
          const skill = await getSkillIdbyName(jsonArray[i].Skill);
          const complexityid = await getcmpIdbyName(jsonArray[i].Complexity);

          if (Object.keys(jsonArray[i]).length != 5) {
            const errorObj = {
              LineNum: i + 1,
              Error: `More or Less fields than required!!`,
            };
            errorArray.push(errorObj);
            jsonObjCount++;
          } else if (
            jsonArray[i].Question.length === 0 ||
            jsonArray[i].Answer.length === 0 ||
            jsonArray[i].Keywords.length === 0
          ) {
            const errorObj = {
              LineNum: i + 1,
              Error: `Please Enter All the fields!!`,
            };
            errorArray.push(errorObj);
            jsonObjCount++;
          } else if (skill == undefined || complexityid == undefined) {
            const errorObj = {
              LineNum: i + 1,
              Error: `Please enter valid Skill or Complexity!!`,
            };
            errorArray.push(errorObj);
            jsonObjCount++;
          }
        }
        if (jsonObjCount > 0) {
          //if invalid rows count is not 0
          var statusMessage = {
            status: "Failed",
            message: `${jsonObjCount} rows are not valid. Please check error file for more details`,
          };
          console.log("Invalid rows found");

          if (errorArray.length > 0) {
            const extension = path.extname(uploadPath);
            const filename = path.basename(uploadPath, extension);
            const errorString = JSON.stringify(errorArray, null, "\t");
            const errFileName = path.join(__dirname,"..","ErrorFiles","Error_" + filename + ".json");
            fs.writeFile(errFileName,errorString,(err) => err && console.error(err));
            
            fs.unlink(uploadPath, (err) => {
              if (err){
                res.status(500).json({err})
              };
              return res.status(200).json(statusMessage);
            });
          }
          //return res.status(200).json(statusMessage);
        } else {
          await uploadqna(jsonArray);
        }
      })
      .on("error", (err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
  async function uploadqna(jsonObj) {
    await ConnectToDb()
      .then(async (dbConnection) => {
        dbConnection.query("BEGIN");
        for (let i = 0; i < jsonObj.length; i++) {
          const skillId = await getSkillIdbyName(jsonObj[i].Skill);
          const cmpId = await getcmpIdbyName(jsonObj[i].Complexity);
          const answerkeywords = jsonObj[i].Keywords;

          await ExecuteQuery(dbConnection,
            `insert into Questions(Question,cmpId,skillId) values('${jsonObj[i].Question}',${cmpId},${skillId})`)
            .then(async (question) => {
              await getQuestionId(dbConnection,skillId,cmpId,jsonObj[i].Question);
            })
            .catch((err) => {
              console.log(err)
              res.status(500).json({Error : err})
            });
          await ExecuteQuery(dbConnection,`insert into Answer(Answer, answerkeywords) values('${jsonObj[i].Answer}','${answerkeywords}')`)
            .then(async (answer) => {
              await getAnswerId(dbConnection, jsonObj[i].Answer).then(
                async (answerId) => {
                  if (ansId != undefined && queId != undefined) {
                    await ExecuteQuery(dbConnection,`insert into Questions_and_Answers(queId,ansId) values(${queId},${ansId})`)
                      .then(async (data) => {
                        console.log(`QueId: ${queId} AnsId: ${ansId} after inserting`);
                        count++;
                      })
                      .catch((err) => {
                        dbConnection.query("ROLLBACK");
                        console.log(err + 6);
                        res.status(500).json({Error : err});
                      });
                  }
                }
              );
            })
            .catch((err) => {
              dbConnection.query("ROLLBACK");
              console.log(err + 3);
              res.status(500).json({Error : err});
            });
        }
      
        if (count == jsonObj.length) {
          dbConnection.query("COMMIT");
          var status = {
            status: "success",
            message: "File Processed Successfully",
          };
          dbConnection.release();
          res.status(200).json(status);
        } else {
          dbConnection.query("ROLLBACK");
          var statusMessage = {
            status: "Failed",
            message: "Couldn't process file. Error occured!!!",
          };
          dbConnection.release();
          res.status(200).json(statusMessage);
        }
      })
      .catch((err) => {
        console.log(err + 2);
        res.status(500).json({Error : err});
      });
  }
  async function getQuestionId(dbConnection, skillId, cmpId, Question) {
    await ExecuteQuery(
      dbConnection,
      `select queId from Questions where Question='${Question}'
       and skillId=${skillId} and cmpId =${cmpId}`
    )
      .then((value) => {
        queId = value[0].queid;
      })
      .catch((err) => {
        console.log(err + 5);
        res.status(500).json({Error : err});
      });
  }
  async function getAnswerId(dbConnection, Answer) {
    await ExecuteQuery(
      dbConnection,
      `select ansId from Answer where Answer='${Answer}'`
    )
      .then((value) => {
        ansId = value[0].ansid;
      })
      .catch((err) => {
        console.log(err + 4);
        res.status(500).json({Error : err});
      });
  }
  readcsvFile();
});
};

async function getSkillIdbyName(skillName) {
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
          dbConnection.release();
          res.status(500).json({ Error: err });
        });
    })
    .catch((err) => {
      console.log(err + 5);
      res.status(500).json({ err });
    });
  return skillid;
}
async function getcmpIdbyName(skilllevel) {
  var cmpid;
  await ConnectToDb()
    .then(async (dbConnection) => {
      await ExecuteQuery(
        dbConnection,
        `select cmpid from complexity where skilllevel ='${skilllevel}'`
      )
        .then((value) => {
          if (value.length !== 0) {
            cmpid = value[0].cmpid;
          }
          dbConnection.release();
        })
        .catch((err) => {
          console.log(err);
          dbConnection.release();
          res.status(500).json({ err });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
  return cmpid;
}

module.exports = { skillsUpload, profileUpload, qnaUpload };
