const {ConnectToDb,ExecuteQuery} = require('../db');
const {fileNanme,logger} = require('../log4');

var fname;

fileNanme(__filename).then((data)=>{
    fname=data;
})


const saveEndAssessment = (req,res) => {
    try {

        logger.trace(`file: ${fname},postMethod storeDataEndAssessment is called`);


        const status = req.body.status;
        const canId = req.body.canId;
        const assessmentId = req.body.assessmentId;
        const endTime = req.body.endTime;
        const InterviewId = req.body.InterviewId;
      
        async function storeDataEndAssessment()
        {
          
          await ConnectToDb().then(async (dbConnection)=>{
            if(dbConnection){
               await ExecuteQuery(dbConnection, `INSERT INTO AssessmentDetails(assessmentId, queId, ansId, score, Note, assessmentDetailsStatus) 
               SELECT assessmentId, queId, ansId, score, Note, AssessmentStagingstatus FROM AssessmentStaging WHERE canId=${canId} AND assessmentId=${assessmentId}`)
      
                .then(async (insertedResponseData)=>{
                    if(insertedResponseData){
                      await ExecuteQuery(dbConnection, `UPDATE Assessment SET assessmentstatus= '${status}',endTime='${endTime}' WHERE canId=${canId} AND assessmentId=${assessmentId}`)
      
                      .then(async (updatedAssessmentData)=>{
                        if(updatedAssessmentData){
                          await ExecuteQuery(dbConnection, `UPDATE Candidates SET Candidatestatus='${status}' WHERE canId = ${canId}`)
      
                          .then(async (updatedCandidateData)=>{
                            if(updatedCandidateData){
      
                              await ExecuteQuery(dbConnection, `UPDATE CandidateInterview SET status='${status}' WHERE canId = ${canId} AND InterviewId=${InterviewId}`)
                              .then(async (updatedInterviewData)=>{
                                if(updatedInterviewData){
          
                                    logger.info(`file: ${fname} , statuscode : 200`)

                                  res.status(200).json({
                                    Status: {
                                      StatusCode: 200,
                      
                                      StatusType: "Success",
                      
                                      StatusMessage: `The assessment and interview information is stored for candidateId ${canId} and status is set to closed`,
                      
                                      StatusSeverity: "Information stored",
                                    }});
                                  dbConnection.release();
                                }
                                else{
                                  res.status(500).send("Storing of assessment and interview iformation failed!!!");
                                  dbConnection.release();
                                }
                              })
                            }
                            else{
                              console.log("Candidate status not updated!!!");
                              dbConnection.release();
                            }
                          })
                        }
                        else{
                          console.log("Assessment status not updated!!!");
                          dbConnection.release();
                        }
                      })
                    }
                    else{
                      console.log("AssessmentDetails data is not inserted!!!");
                      dbConnection.release();
                    }
                })
                .catch((err)=>{
                    logger.fatal(`file: ${fname},error: ${err} -1`); 
                    res.status(500).json({err});
                    dbConnection.release();
                })
            }
            else{
                console.log("Not connected to db");
            }
        }).catch((err)=>{
            logger.fatal(`file: ${fname},error: ${err} -2`); 
            res.status(500).json({err});
        })
        }
       
        storeDataEndAssessment();
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    saveEndAssessment
}