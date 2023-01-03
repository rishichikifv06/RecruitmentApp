const {ConnectToDb,ExecuteQuery} = require('../db');
const {fileNanme,logger} = require('../log4');

var fname;

fileNanme(__filename).then((data)=>{
    fname=data;
})

const scheduleInterviewForCandidate = (req,res) => {
    try {
        logger.trace(`file: ${fname},postMethod InsertCandidateInterview is called`);

        const canId = req.body.canId;
        const date = req.body.date;
        const interviewSkills = req.body.interviewSkills
        async function InsertCandidateInterview()//Insert CandidateInterview
        {
          await ConnectToDb().then(async (dbConnection) => {
            if (dbConnection) {
             checkCandidateInterview(dbConnection);
            }
            else {
              console.log("Not connected to db");
            }
          }).catch((err) => {
            console.log(err + 2);
          })
        }
        async function checkCandidateInterview(dbConnection) {
          await ExecuteQuery(dbConnection, `select * from CandidateInterview where canId=${canId} and date='${date}' `)
            .then((count) => {
              if (count.length!=0) {
                var statusMessage = {
                  StatusCode: 400,
                  StatusType: "Failed",
                  StatusMessage: `Interview already exists on '${date}' !!!`,
                  StatusSeverity: "Information already exists"
                }
                logger.info(`file: ${fname} , statuscode : 200`)
                res.status(200).json({statusMessage});
                dbConnection.release();
              }
              else{
                console.log("else check function");
                 insertCandidateInterview(dbConnection);
              }
            })
            .catch((err) => {
                logger.fatal(`file: ${fname},error: ${err} -1`); 
            })
        }
        async function insertCandidateInterview(dbConnection) {            
          await ExecuteQuery(dbConnection, `insert into CandidateInterview(canId,date,status) values(${canId},'${date}','Open')`)
            .then(async (result) => {
              if (result) {
                console.log("interview record inserted")
                await ExecuteQuery(dbConnection, `select InterviewId from CandidateInterview where canId=${canId} and date='${date}' and status='Open' `)
                  .then(async (interviewId) => {
                    if (interviewId) {
                      let id = interviewId[0].InterviewId;
                      console.log(id, "interview id");
                      await insertIntoInterviewSkills(dbConnection, interviewSkills, id)
                        .then((insertedSkillsData) => {
                          if (insertedSkillsData) {
                            console.log("interview skills function call");
                            var statusMessage = {
                              StatusCode: 200,
                              StatusType: "success",
                              StatusMessage: `Interview is scheduled for Candidate ${canId} on ${date}!!!`,
                              StatusSeverity: "Information loaded"
                            }
                            res.status(200).json(statusMessage);
                            dbConnection.release();
                          }
                          else {
                            var statusMessage = {
                              "status": "Failed",
                              "message": "Not inserted into IterviewSkills table!!!"
                            }
                            res.status(200).json(statusMessage);
                            dbConnection.release();
                          }
                        })
                    }
                    else {
                      var statusMessage = {
                        "status": "Failed",
                        "message": "Not inserted into CandidateInterview table!!!"
                      }
                      res.status(200).json(statusMessage);
                      dbConnection.release();
                    }
                  })
              }
            })
            .catch((err) => {
              console.log(err + 1);
              res.status(500).json({err});
              dbConnection.release();
            })
        }
        async function insertIntoInterviewSkills(dbConnection, skills, InterviewId) {
          let count = 0;
          for (let i = 0; i < skills.length; i++) {
            await ExecuteQuery(dbConnection, `insert into InterviewSkills(skillId,cmpId,InterviewId) values(${skills[i].skillId},${skills[i].cmpId},${InterviewId})`)
              .then((result) => {
                if (result) {
                  count++;
                  console.log(result, "inserted into interview skills");
                }
              })
              .catch((err) => {
                console.log(err + 4);
              })
          }
          if (count === skills.length) {
            console.log("interview skills function defination");
            return "skills inserted successfully!!!";
          }
          return null;
        }
        InsertCandidateInterview();  //insert into CandidateInterview
    } catch (error) {
        console.log(error);
    }
}


const fetchInterviewSkills = (req,res) => {
    try {
        logger.trace(`file: ${fname},postMethod getInterviewSkills is called`);

        const InterviewId = req.body.InterviewId;

        async function getInterviewSkills()
        {
          await ConnectToDb().then(async (dbConnection)=>{
            if(dbConnection){
                await ExecuteQuery(dbConnection, `select Skill.skillName,Skill.skillId, Complexity.SkillLevel, Complexity.cmpId from InterviewSkills
                left join Skill on Skill.skillId=InterviewSkills.skillId
                left join Complexity on Complexity.cmpId=InterviewSkills.cmpId 
                where InterviewId=${InterviewId}`)
                .then((InterviewSkillsData)=>{
                    if(InterviewSkillsData)
                    {
                        logger.info(`file: ${fname} , statuscode : 200`)

                        res.status(200).json({
                          Status: {
                            StatusCode: 200,
            
                            StatusType: "Success",
            
                            StatusMessage: "Record Found",
            
                            StatusSeverity: "Information",
                          },InterviewSkillsData});
                        dbConnection.release();
                    }
                    else{
                        var statusMessage={
                            "status":"Failed",
                            "message":"Could not fetch Inerview Skills !!!"
                        }
                        res.status(200).json(statusMessage);
                        dbConnection.release();
                    }
                })
                .catch((err)=>{
                    logger.fatal(`file: ${fname},error: ${err} -2`); 
                    res.status(500).json({err});
                })
    
            }
            else{
              console.log("Not connected to db");
            }
           }).catch((err)=>{
            logger.fatal(`file: ${fname},error: ${err} -3`); 
            res.status(500).json({err});
           })
          }
          getInterviewSkills(); 
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    scheduleInterviewForCandidate,
    fetchInterviewSkills
}