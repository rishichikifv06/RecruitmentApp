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
  });
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
        if (jsonObjCount != 0) {
          var statusMessage = {
            statusCode: 200,
            status: "Failed",
            message: `${jsonObjCount} rows are not valid. Please check error file for more details`,
          };
          console.log("Invalid rows found");
          if (errorArray.length !== 0) {
            const extension = path.extname(uploadPath);
            const filename = path.basename(uploadPath, extension);
            const errorString = JSON.stringify(errorArray, null, "\t");
            const errFileName = (uploadPath = path.join(
              __dirname,"..","ErrorFiles","Error_" + filename + ".json"
            ));
            fs.writeFile(
              errFileName,
              errorString,
              (err) => err && console.error(err)
            );
          }
          return res.status(200).json(statusMessage);
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
                console.log("Skill not inserted");
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
        console.log("Not connected to db");
        console.log(err);
        res.status(500).json({ err });
      });
  }

  readcsvFile();
};

const profileUpload = (req, res) => {
  // const uploadedfile = req.body.uploadedfile;
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
  });

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

            // console.log(jsonArray)
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
            //if invalid rows count is not 0
            var statusMessage = {
              status: "Failed",
              message: `${jsonObjCount} rows are not valid. Please check file and upload again`,
            };
            console.log("Invalid rows found");

            if (errorArray.length > 0) {
              const extension = path.extname(uploadPath);
              const filename = path.basename(uploadPath, extension);
              const errorString = JSON.stringify(errorArray, null, "\t");
              const errFileName = (uploadPath = path.join(
                __dirname,
                "..",
                "ErrorFiles",
                "Error_" + filename + ".json"
              ));
              fs.writeFile(
                errFileName,
                errorString,
                (err) => err && console.error(err)
              );
            }
            return res.status(200).json(statusMessage);
          } else {
            //prepare JsonArray for particular candidate and create reecords using function
            var skillsArray = [];
            console.log(jsonArray);

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
                console.log("payload");
                console.log(payLoadProfile);
                // const data =
                const data = await uploadProfile(payLoadProfile);
                console.log('line 270' + JSON.stringify(data));
                if (!data.status) {
                    var statusMessage = {
                      status: "Failed",
                      message: "Failed to prcoess the File",
                    };
                    res.status(500).json(statusMessage);
                  }

              } else if (i !== jsonArray.length) {
                // if it's last record of particular candidate
                if (jsonArray[i].canName != jsonArray[i + 1].canName) {
                  console.log("payload2");
                  console.log(payLoadProfile);
                  const data = await uploadProfile(payLoadProfile);
                  if (!data.status) {
                    var statusMessage = {
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
    async function uploadProfile(ipObj) {
      // logger.trace(
      //   `file: ${fname},postMethod toCreateCandidateProfile is called`
      // );
      const emailId = ipObj.EmailId;
      const name = ipObj.canName;
      const phone = ipObj.canPhone;
      const experience = ipObj.canExperience;
      const skills = ipObj.skills;
      var data = {};

      async function toCreateCandidateProfile() {
        await ConnectToDb()
          .then(async (dbConnection) => {
            if (dbConnection) {
              await ExecuteQuery(dbConnection, "BEGIN").catch((err) => {
                console.log(err + 379);
              });
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
                      console.log(`line 390 ${candidateData}`);
                      if (candidateData) {
                        const [{ canid }] = candidateData;
                        await toInsertSkillsForCandidate(canid, dbConnection)
                          .then(async (insertedSkillsData) => {
                            if (insertedSkillsData) {
                              dbConnection.query("COMMIT");
                              await dbConnection.release();
                              data.status = true;
                              return data;
                            } else {
                              dbConnection.query("ROLLBACK");
                              res
                                .status(500)
                                .send("Profile creation failed!!!");
                              dbConnection.release();
                            }
                          })
                          .catch(async (err) => {
                            //logger.fatal(`file: ${fname},error: ${err} -1`);
                            dbConnection.query("ROLLBACK");
                            await res.status(500).json({
                              err,
                            });
                            await dbConnection.release();
                          });
                      } else {
                        console.log("Candidates Data not selected!!!");
                        dbConnection.query("ROLLBACK");
                        dbConnection.release();
                      }
                    });
                  } else {
                    console.log("Candidates data is not inserted!!!");
                    dbConnection.query("ROLLBACK");
                    dbConnection.release();
                  }
                })
                .catch(async (err) => {
                  //logger.fatal(`file: ${fname},error: ${err} -2`);
                  await res.status(500).json({
                    err,
                  });
                  await dbConnection.release();
                });
            } else {
              console.log("Not connected to db");
            }
          })
          .catch(async (err) => {
            //logger.fatal(`file: ${fname},error: ${err} -3`);
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
};

module.exports = { skillsUpload, profileUpload };
