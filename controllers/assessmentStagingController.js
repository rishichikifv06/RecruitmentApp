const {ConnectToDb,ExecuteQuery} = require('../db');
const {fileNanme,logger} = require('../log4');

var fname;

fileNanme(__filename).then((data)=>{
    fname=data;
})

const fetchQaFromAssessmentStaging = (req,res) => {
    try {
        logger.trace(`file: ${fname},postMethod getSingleQandAFromStaging is called`);
        console.log('request')
console.log(req.body)
        var canId = req.body.canId;
        var RowandQuestion_number = req.body.RowandQuestion_number;
        var assessmentId = req.body.assessmentId;
     
       async function getSingleQandAFromStaging()
       {
         await ConnectToDb().then(async (dbConnection)=>{
           if(dbConnection){
             var count = await getTotalCount(dbConnection);
             await ExecuteQuery(dbConnection, `SELECT Questions.Question, Answer.Answer, Answer.Answerkeywords, AssessmentStaging.RowandQuestion_number,Skill.skillName,Complexity.Name , AssessmentStaging.AssessmentStagingstatus ,AssessmentStaging.score, AssessmentStaging.Note
             FROM AssessmentStaging
             LEFT JOIN Questions ON Questions.queId=AssessmentStaging.queId LEFT JOIN Skill ON Questions.skillId=Skill.skillId 
             LEFT JOIN Complexity ON Questions.cmpId=Complexity.cmpId
             LEFT JOIN Answer ON Answer.ansId=AssessmentStaging.ansId
             WHERE canId=${canId} and assessmentId=${assessmentId} and RowandQuestion_number=${RowandQuestion_number}`)
             .then(async (result)=>{
               
               if(result){
                 console.log(result);
                 result[0].currentRecordId = RowandQuestion_number;
                 result[0].firsRecordId = 1;
                 result[0].nextRecordId = RowandQuestion_number+1;
                 result[0].previosRecordId = RowandQuestion_number-1;
                 result[0].lastRecordId = count;
                 res.status(200).json({
                   Status: {
                     StatusCode: 200,
     
                     StatusType: "Success",
     
                     StatusMessage: "Record Found",
     
                     StatusSeverity: "Information",
                   },result});
                   logger.info(`file: ${fname} , statuscode : 200`)

                 dbConnection.release();
               }
             })
             .catch((err)=>{
                logger.fatal(`file: ${fname},error: ${err} -1`); 
                res.status(500).json(err);
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
      
       getSingleQandAFromStaging();
     
       async function getTotalCount(dbConnection){
     
         var count = 0;
     
         await ExecuteQuery(dbConnection, `select count(AssessmentStaging.RowandQuestion_number) as Qcount from AssessmentStaging where assessmentId=${assessmentId}`)
         .then((countOfQA)=>{
           if(countOfQA){
             count = countOfQA[0].qcount;
           }
           else{
             console.log("count value not acquired!!");
           }
         })
     
         if(count>0){
           return count;
         }
         return null;
       }
    } catch (error) {
        console.log(error);
    }
}


const saveScoreNoteInAssessmentStaging = (req,res) => {
    try {
        logger.trace(`file: ${fname},postMethod saveScoreNote is called`);
console.log('result savescore')
console.log(req.body)
        var canId = req.body.canId;
        var RowandQuestion_number = req.body.RowandQuestion_number;
        var score = req.body.score;
        var notes = req.body.notes;
        console.log(notes);
      
        async function saveScoreNote()
        {
          await ConnectToDb().then(async (dbConnection)=>{
            await ExecuteQuery(dbConnection, `UPDATE AssessmentStaging SET score=${score} ,Note='${notes}', AssessmentStagingstatus='closed' WHERE canId = ${canId} AND 
            RowandQuestion_number = ${RowandQuestion_number}`)
            .then((updatedData)=>{
                logger.info(`file: ${fname} , statuscode : 200`)
              res.status(200).json({
                Status: {
                  StatusCode: 200,
                  StatusType: "Success",
                  StatusMessage: `The response is saved successfully for candidateId ${canId} and question number ${RowandQuestion_number}`,
                  StatusSeverity: "Information updated"
                }
              })
              dbConnection.release();
            })
            .catch((err)=>{
                logger.fatal(`file: ${fname},error: ${err} -3`); 
                res.status(500).json({err});
              dbConnection.release();
            })
          })
          .catch((err)=>{
            logger.fatal(`file: ${fname},error: ${err} -4`); 
            res.status(500).json({err});
          })
        }
       
        saveScoreNote();
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    fetchQaFromAssessmentStaging,
    saveScoreNoteInAssessmentStaging

}