const { ConnectToDb, ExecuteQuery } = require("../db");
const { fileNanme, logger } = require("../log4");
var path = require("path");
const csv = require("csv-parser");
const fs = require("fs");
const canadidateSkillsRepo = require("../DataBase/CandidateSkills_Repo");
const candidatesRepo = require("../DataBase/Candidates_Repo");
const fileUploadService = require("../Services/fileUploadServices");

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
      var readStream = fs.createReadStream(uploadPath);
      readStream
        .pipe(csv({}))
        .on("headers", (headers) => {
          if (headers.length !== 1) {
            res.status(500).json({ message: "Please upload skills file" });
            readStream.destroy();
          }
        })
        .on("data", (data) => jsonArray.push(data))
        .on("end", async () => {
          if (jsonArray.length < 1) {
            fs.unlink(uploadPath, (err) => {
              if (err) {
                res.status(500).json({ err });
              }
              return res.status(500).json({ message: "Empty file selected" });
            });
          } else {
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
              } else {
                const exists = await checkifexists(jsonArray[i].SkillName);
                if (exists) {
                  const errorObj = {
                    LineNum: i + 1,
                    Error: `SkillName is already present!!`,
                  };
                  errorArray.push(errorObj);
                  jsonObjCount++;
                }
              }
            }
            if (jsonObjCount > 0) {
              var statusMessage = {
                statusCode: 200,
                status: "Failed",
                message: `${jsonObjCount} rows are not valid. Please check error file for more details`,
              };

              if (errorArray.length > 0) {
                const extension = path.extname(uploadPath);
                const filename = path.basename(uploadPath, extension);
                const errorString = JSON.stringify(errorArray, null, "\t");
                const errFileName = path.join(
                  __dirname,
                  "..",
                  "ErrorFiles",
                  "Error_" + filename + ".json"
                );
                fs.writeFile(
                  errFileName,
                  errorString,
                  (err) => err && console.error(err)
                );

                fs.unlink(uploadPath, (err) => {
                  if (err) {
                    res.status(500).json({ err });
                  }
                  return res.status(200).json(statusMessage);
                });
              }
              //return res.status(200).json(statusMessage);
            } else {
              await uploadfile(jsonArray);
            }
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
          await dbConnection.query("BEGIN");
          for (let i = 0; i < ipJsonArray.length; i++) {
            skillName = ipJsonArray[i].SkillName;
            if (skillName != undefined) {
              await ExecuteQuery(
                dbConnection,
                `insert into Skill(skillName) values('${skillName}')`
              )
                .then(async () => {
                  count++;
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
          if (count == ipJsonArray.length) {
            var status = {
              status: "success",
              message: "File Processed Successfully",
            };
            await dbConnection.query("COMMIT");
            await dbConnection.release();
            return res.status(200).json(status);
          } else {
            var statusMessage = {
              status: "Failed",
              message: "Could not process file!!!",
            };
            await dbConnection.query("ROLLBACK");
            await dbConnection.release();
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

  sampleFile.mv(uploadPath, async function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    try {
      var jsonArray = [];
      var readStream = fs.createReadStream(uploadPath);
      readStream
        .pipe(csv({}))
        .on("data", (data) => jsonArray.push(data))
        .on("headers", (headers) => {
          if (headers.length !== 6) {
            res.status(500).json({ message: "Please upload Profiles file" });
            readStream.destroy();
          }
        })
        .on("end", async () => {
          try {
            if (jsonArray.length < 1) {
              fs.unlink(uploadPath, (err) => {
                if (err) {
                  res.status(500).json({ err });
                }
                return res.status(500).json({ message: "Empty file selected" });
              });
            } else {
              const valResult = await fileUploadService.validateProfiles(jsonArray);

              if (valResult.errorcount > 0) {
                var statusMessage = {
                  status: "Failed",
                  message: `${valResult.errorcount} rows are not valid. Please check error file for more details`,
                };

                if (valResult.errorArray.length > 0) {
                  const errorfilename = await fileUploadService.getErrorPath(uploadPath);
                  const errorString = JSON.stringify(valResult.errorArray,null,"\t");
                  fs.writeFile(
                    errorfilename,
                    errorString,
                    (err) => err && console.error(err)
                  );

                  fs.unlink(uploadPath, (err) => {
                    if (err) {
                      res.status(500).json({ err });
                    }
                    return res.status(200).json(statusMessage);
                  });
                }
              } else {
                //prepare array of candidate with skills array for each candidate object
                var skillsArray = [];
                var candidateArray = [];

                for (let i = 0; i < jsonArray.length; i++) {
                  var skillsObj = {};
                  const skillId = await getSkillIdbyName(jsonArray[i].Skill);
                  const cmpId = await getcmpIdbyName(jsonArray[i].Complexity);

                  skillsObj = {
                    skillId: skillId,
                    cmpId: cmpId,
                  };

                  if (i >= 1) {
                    var lastCandidate = jsonArray[i - 1].EmailId;
                  }
                  if (lastCandidate != jsonArray[i].EmailId) {
                    skillsArray = [];
                    var candidateObject = {
                      canname: jsonArray[i].canName,
                      canphone: jsonArray[i].canPhone,
                      canexperience: jsonArray[i].canExperience,
                      emailid: jsonArray[i].EmailId,
                    };
                    skillsArray.push(skillsObj);
                    candidateObject["skills"] = skillsArray;
                  } else {
                    skillsArray.push(skillsObj);
                    candidateObject.skills = skillsArray;
                  }

                  //if it's a last record
                  if (i === jsonArray.length - 1) {
                    candidateArray.push(candidateObject);
                  } else if (i !== jsonArray.length) {
                    // if it's last record of particular candidate
                    if (jsonArray[i].canName != jsonArray[i + 1].canName) {
                      candidateArray.push(candidateObject);
                    }
                  }
                }

                console.log(candidateArray);
                const dbConnecton = await ConnectToDb();
                try {
                  await dbConnecton.query("BEGIN");
                  for (let i = 0; i < candidateArray.length; i++) {
                    await candidatesRepo.addCandidate(candidateArray[i],dbConnecton);
                    const canid =
                      await candidatesRepo.getCandidateByEmaildb(candidateArray[i],dbConnecton);
                    candidateArray[i].skills.forEach((v) => {v.canid = canid;});

                    console.log(candidateArray[i].skills);
                    for (let j = 0; j < candidateArray[i].skills.length; j++) {
                      await canadidateSkillsRepo.addCandidateskills(candidateArray[i].skills[j],dbConnecton);
                    }
                  }
                } catch (error) {
                  console.log("Error while adding profiles");
                  await dbConnecton.query("ROLLBACK");
                  await dbConnecton.release();
                  throw error;
                }

                var statusMessage = {
                  status: "Success",
                  message: "Profiles created successfully",
                };
                await dbConnecton.query("COMMIT");
                await dbConnecton.release();
                res.status(200).json(statusMessage);
              }
            }
          } catch (err) {
            console.log("error while uploading file");
            console.log(err);
            res.status(500).json({err});
          }
        })
        .on("error", (err) => {
          console.log(err);
          res.status(500).json({ err });
        });
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
      var readStream = fs.createReadStream(uploadPath);
      readStream
        .pipe(csv({}))
        .on("data", (data) => jsonArray.push(data))
        .on("headers", (headers) => {
          if (headers.length != 5) {
            res.status(500).json({ message: "Please upload QNA file" });
            readStream.destroy();
          }
        })
        .on("end", async () => {
          if (jsonArray.length < 1) {
            fs.unlink(uploadPath, (err) => {
              if (err) {
                res.status(500).json({ err });
              }
              return res.status(500).json({ message: "Empty file selected" });
            });
          } else {
            var errorArray = [];
            for (let i = 0; i < jsonArray.length; i++) {
              const skill = await getSkillIdbyName(jsonArray[i].Skill);
              const complexityid = await getcmpIdbyName(
                jsonArray[i].Complexity
              );

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
              } else {
                const exists = await Questionexists(jsonArray[i].Question);
                if (exists) {
                  const errorObj = {
                    LineNum: i + 1,
                    Error: `Question is already present!!`,
                  };
                  errorArray.push(errorObj);
                  jsonObjCount++;
                }
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
                const errFileName = path.join(
                  __dirname,
                  "..",
                  "ErrorFiles",
                  "Error_" + filename + ".json"
                );
                fs.writeFile(
                  errFileName,
                  errorString,
                  (err) => err && console.error(err)
                );

                fs.unlink(uploadPath, (err) => {
                  if (err) {
                    res.status(500).json({ err });
                  }
                  return res.status(200).json(statusMessage);
                });
              }
            } else {
              await uploadqna(jsonArray);
            }
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

            await ExecuteQuery(
              dbConnection,
              `insert into Questions(Question,cmpId,skillId) values('${jsonObj[i].Question}',${cmpId},${skillId})`
            )
              .then(async (question) => {
                await getQuestionId(
                  dbConnection,
                  skillId,
                  cmpId,
                  jsonObj[i].Question
                );
              })
              .catch((err) => {
                console.log(err);
                console.log(
                  `Error while inserting question ${jsonObj[i].Question}`
                );
              });
            await ExecuteQuery(
              dbConnection,
              `insert into Answer(Answer, answerkeywords) values('${jsonObj[i].Answer}','${answerkeywords}')`
            )
              .then(async (answer) => {
                await getAnswerId(dbConnection, jsonObj[i].Answer).then(
                  async (answerId) => {
                    if (ansId != undefined && queId != undefined) {
                      await ExecuteQuery(
                        dbConnection,
                        `insert into Questions_and_Answers(queId,ansId) values(${queId},${ansId})`
                      )
                        .then(async (data) => {
                          console.log(
                            `QueId: ${queId} AnsId: ${ansId} after inserting`
                          );
                          count++;
                        })
                        .catch((err) => {
                          console.log(
                            `Error while inserting answers for ${queId}`
                          );
                          console.log(err);
                        });
                    }
                  }
                );
              })
              .catch((err) => {
                console.log(
                  `Error while inserting answer ${jsonObj[i].Answer}`
                );
                console.log(err);
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
          res.status(500).json({ Error: err });
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
          console.log(`Error occured while in getQuestionId for ${Question}`);
          console.log(err);
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
          console.log(`Error occured in getAnswerId for ${Answer}`);
          console.log(err);
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
          console.log(`Error in getSkillIdbyName for skillname ${skillName}`);
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
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
        });
    })
    .catch((err) => {
      console.log(err);
    });
  return cmpid;
}

async function checkifexists(ipskillname) {
  var isexists;
  try {
    await ConnectToDb()
      .then(async (dbConnection) => {
        await ExecuteQuery(
          dbConnection,
          `select * from Skill where skillName = '${ipskillname}'`
        )
          .then((result) => {
            if (result.length > 0) {
              isexists = true;
            }
            dbConnection.release();
          })
          .catch(async (err) => {
            await dbConnection.release();
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
    return isexists;
  } catch (err) {
    console.log(err);
    console.log("error while checking if Skill already exists");
  }
}

async function Questionexists(ipQuestion) {
  var isexists;
  try {
    await ConnectToDb()
      .then(async (dbConnection) => {
        await ExecuteQuery(
          dbConnection,
          `select * from Questions where question = '${ipQuestion}'`
        )
          .then((result) => {
            if (result.length > 0) {
              isexists = true;
            }
            dbConnection.release();
          })
          .catch(async (err) => {
            await dbConnection.release();
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
    return isexists;
  } catch (err) {
    console.log(err);
    console.log("error while checking if Question already exists");
  }
}

module.exports = { skillsUpload, profileUpload, qnaUpload };
