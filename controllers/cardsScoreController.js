const {ConnectToDb,ExecuteQuery} = require('../db');
const {fileNanme,logger} = require('../log4');

var fname;

fileNanme(__filename).then((data)=>{
    fname=data;
})

const fetchScoresForCandidate = (req,res) => {
    try {
        logger.trace(`file: ${fname},postMethod getScore is called`);
        async function getScore()
        {
            const canId = req.body.canId;
            const Date = req.body.Date;
            await ConnectToDb()
            .then(async (dbConnection)=>{
        
                    await ExecuteQuery(dbConnection, `select assessmentId from Assessment where canId=${canId} and date='${Date}'`)
                    .then(async (assessmentIdData)=>{
                        let assessmentId = assessmentIdData[0].assessmentId;
                        await ExecuteQuery(dbConnection, `select Skill.skillName, Sum(AssessmentDetails.score) as "candidateScore",count(Questions.skillId)as 
                        "count" from AssessmentDetails left join Questions
                        on Questions.queId=AssessmentDetails.queId 
                        LEFT JOIN Skill ON Questions.skillId=Skill.skillId LEFT JOIN Complexity ON Questions.cmpId=Complexity.cmpId where assessmentId=${assessmentId} 
                        group by Skill.skillName`)
                        .then(async (skillData)=>{
                            skillData.forEach(element => {
                                element.skillScore = element.count*10;
                                element.percentage = Math.round(element.candidateScore/element.skillScore*100);
                            });
        
                                let totalCount = 0;
                                let totalScore = 0;
                                let totalPercentage = 1;
                                let totalCandidateScore = 0;
                                skillData.forEach(element => {
                                    totalCount = totalCount+element.count;
                                    totalScore = totalScore+element.skillScore;
                                    totalCandidateScore = totalCandidateScore+element.candidateScore;  
                                })
                                totalPercentage = Math.round(totalCandidateScore/totalScore*100);
        
                                let data = {
                                    skillData,
                                    totalCount: totalCount,
                                    totalScore: totalScore,
                                    totalCandidateScore: totalCandidateScore,
                                    totalPercentage: totalPercentage
                                }
                                logger.info(`file: ${fname} , statuscode : 200`)
                                await res.status(200).json({
                                    Status: {
                                        StatusCode: 200,
                        
                                        StatusType: "Success",
                        
                                        StatusMessage: "Record Found",
                        
                                        StatusSeverity: "Information",
                                      },data});
                                await dbConnection.release();
                        })
                        .catch(async (err)=>{
                            logger.fatal(`file: ${fname},error: ${err} -1`); 
                            await res.status(500).json({err});
                            await dbConnection.release();
                        })
                    })
                    .catch(async (err)=>{
                        logger.fatal(`file: ${fname},error: ${err} -2`); 
                        await res.status(500).json({err});
                        await dbConnection.release();
                    })
                
            }).catch(async (err)=>{
                logger.fatal(`file: ${fname},error: ${err} -3`); 
                await res.status(500).json({err})
            })
        }
        getScore();
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    fetchScoresForCandidate
}