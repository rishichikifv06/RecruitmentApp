const { ConnectToDb, ExecuteQuery } = require("../db");

const allQA = (req, res) => {
  if (req.body != undefined) {
    const interviewid = req.body.interviewid;
    var assessmentid;
    var assessmentdetails;
    console.log(interviewid);

    //   logger.info(`file: ${fname},post allQA is called`);

    async function getAllQandA() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          if (dbConnection) {
            await ExecuteQuery(
              dbConnection,
              `select assessmentid, date from assessment where interviewid = ${interviewid}`
            )
              .then(async (value) => {
                console.log(value);
                assessmentid = value[0].assessmentid;
                console.log(assessmentid);
                await ExecuteQuery(
                  dbConnection,
                  ` select  Sum(AssessmentDetails.score) as "candidateScore" ,
               count(*) as "TotalQuestions" , count(assessmentdetails.note) as "answered" from assessmentdetails where assessmentId=${assessmentid}  `
                )
                  .then((result) => {
                    assessmentdetails = result[0];
                    assessmentdetails.totalscore =
                      assessmentdetails.TotalQuestions * 10;
                  })
                  .catch((err) => {
                    console.log(err);
                  });

                await ExecuteQuery(
                  dbConnection,
                  `select  questions.question,questions.queId,answer,answerkeywords,answer.ansId, questions.cmpid, complexity.name, skill.skillName , questions.skillid, score, note from assessmentdetails
                left join answer on answer.ansId=assessmentdetails.ansId inner join questions on questions.queId=assessmentdetails.queId left join complexity on complexity.cmpid=questions.cmpid
                left join skill on skill.skillid=questions.skillid
                where  assessmentId=${assessmentid}`
                )
                  .then((result) => {
                    // result.date=value[0].date;
                    console.log(result);
                    //   logger.fatal(`file: ${fname} , statuscode : 200`)
                    res.status(200).json({
                      Status: {
                        StatusCode: 200,

                        StatusType: "Success",

                        StatusMessage: "Record Found",

                        StatusSeverity: "Information",
                      },
                      result,
                      date: value[0].date,
                      details: assessmentdetails,
                    });
                    dbConnection.release();
                  })
                  .catch((err) => {
                    console.log(err);
                    //   logger.error(`file: ${fname},error: ${err} -1`);
                    res.status(500).json(err);
                    dbConnection.release();
                  });
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json(err);
              });
          } else {
            // logger.warn(`file: ${fname},error: db is not connected`);
          }
        })
        .catch((err) => {
          //   logger.error(`file: ${fname},error: ${err} -2`);
          dbConnection.release();
        });
    }

    getAllQandA();
  }
};

module.exports = { allQA };
