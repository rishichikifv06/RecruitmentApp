const { ConnectToDb, ExecuteQuery } = require("../db");
const { fileNanme, logger } = require("../log4");

var fname;

fileNanme(__filename).then((data) => {
  fname = data;
});

const fetchAllListDetail = (req, res) => {
  try {
    logger.trace(`file: ${fname},getMethod fetchAllListDetail is called`);

    async function getListDataDetail() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          await ExecuteQuery(dbConnection, `select * from listdatadetail`)
            .then((result) => {
              logger.info(`file: ${fname} , statuscode : 200`);
              res.status(200).json({
                Status: {
                  StatusCode: 200,

                  StatusType: "Success",

                  StatusMessage: "Record Found",

                  StatusSeverity: "Information",
                },
                result: result,
              });
              dbConnection.release();
            })
            .catch((err) => {
              console.log(err);
              logger.fatal(`file: ${fname},error: ${err} -1`);
              res.status(500).json({ err });
              dbConnection.release();
            });
        })
        .catch((err) => {
          console.log(err);
          logger.fatal(`file: ${fname},error: ${err} -2`);
        });
    }
    getListDataDetail();
  } catch (err) {
    console.log(err);
    logger.fatal(`file: ${fname},error: ${err} -3`);
  }
};

const fetchListDetailByMasterId = (req, res) => {
  try {
    logger.trace(
      `file: ${fname},getMethod fetchListDetailByMasterId is called`
    );
    const listMstId = req.params.ListMstId;
    async function getListDataDetailByMasterId() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          await ExecuteQuery(
            dbConnection,
            `select * from listdatadetail where listdatadetail.listmstid = '${listMstId}'`
          )
            .then(async (result) => {
              if (result.length != 0) {
                logger.info(`file: ${fname} , statuscode : 200`);
                res.status(200).json({
                  Status: {
                    StatusCode: 200,
                    StatusType: "Success",
                    StatusMessage: "Record Found",
                    StatusSeverity: "Information",
                  },
                  result: result,
                });
                dbConnection.release();
              } else {
                logger.info(`file: ${fname} , statuscode : 200`);
                var status = {
                  Message: `Record does not found`,
                };
                res.status(200).json(status);
                dbConnection.release();
              }
            })
            .catch((err) => {
              logger.fatal(`file: ${fname},error: ${err} -4`);
              console.log(err);
              res.status(500).json({ err });
              dbConnection.release();
            });
        })
        .catch((err) => {
          logger.fatal(`file: ${fname},error: ${err} -5`);
          console.log(err);
        });
    }
    getListDataDetailByMasterId();
  } catch (err) {
    logger.fatal(`file: ${fname},error: ${err} -6`);
    console.log(err);
  }
};

const deleteListDetailByListDtlId = (req, res) => {
  try {
    logger.trace(
      `file: ${fname},deleteMethod deleteListDetailByListDtlId is called`
    );
    const listDtlId = req.params.ListDtlId;

    async function deleteListDetail() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          await ExecuteQuery(
            dbConnection,
            `DELETE FROM listdatadetail WHERE listdatadetail.listdtlid = '${listDtlId}'`
          )
            .then((result) => {
              logger.info(`file: ${fname} , statuscode : 200`);
              res.status(200).json({
                Status: {
                  StatusCode: 200,
                  StatusType: "Success",
                  StatusMessage: "Record Deleted Successfully",
                  StatusSeverity: "Information",
                },
              });
              dbConnection.release();
            })
            .catch((err) => {
              logger.fatal(`file: ${fname},error: ${err} -7`);
              console.log(err);
              res.status(500).json({ err });
              dbConnection.release();
            });
        })
        .catch((err) => {
          logger.fatal(`file: ${fname},error: ${err} -8`);
          console.log(err);
        });
    }
    deleteListDetail();
  } catch (err) {
    console.log(err);
    logger.fatal(`file: ${fname},error: ${err} -9`);
  }
};

const addListDetailToDb = (req, res) => {
  try {
    logger.trace(`file: ${fname},postMethod addListDetailToDb is called`);

    const listMstId = req.body.listMstId;
    const listDtlValue = req.body.listDtlValue;
    const listDtlDesc = req.body.listDtlDesc;
    const listDtlComment = req.body.listDtlComment;

    async function addListDetail() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          if (dbConnection) {
            await ExecuteQuery(
              dbConnection,
              `SELECT listcode FROM listdatamaster WHERE listmstid ='${listMstId}'`
            )
              .then(async (selectedmaster) => {
                if (selectedmaster.length != 0) {
                  await ExecuteQuery(
                    dbConnection,
                    `SELECT listdtlvalue FROM listdatadetail WHERE listmstid ='${listMstId}' AND listdtlvalue = '${listDtlValue}'`
                  )
                    .then(async (selectedlistdetail) => {
                      if (selectedlistdetail.length != 0) {
                        logger.info(`file: ${fname} , statuscode : 200`);
                        var status = {
                          Message: `The List Detail ${listDtlValue} is already present for master ${listMstId}!!`,
                        };
                        res.status(200).json(status);
                        dbConnection.release();
                      } else {
                        await ExecuteQuery(
                          dbConnection,
                          `INSERT INTO listdatadetail(listmstid, listdtlvalue, listdtldesc, listdtlcomment) VALUES ('${listMstId}', '${listDtlValue}', '${listDtlDesc}', ${listDtlComment})`
                        )
                          .then((result) => {
                            logger.info(`file: ${fname} , statuscode : 200`);
                            var status = {
                              status: "success",
                              Message: `listDtlValue ${listDtlValue} added successfully for master ${listMstId}!!`,
                            };
                            res.status(200).json(status);
                            dbConnection.release();
                          })
                          .catch((err) => {
                            logger.fatal(`file: ${fname},error: ${err} -10`);
                            console.log(err);
                            res.status(500).json(err);
                            dbConnection.release();
                          });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      logger.fatal(`file: ${fname},error: ${err} -11`);
                      dbConnection.release();
                    });
                } else {
                  logger.info(`file: ${fname} , statuscode : 200`);
                  var status = {
                    Message: `listMstId ${listMstId} does not exist!! Please add master data`,
                  };
                  res.status(200).json(status);
                  dbConnection.release();
                }
              })
              .catch((err) => {
                logger.fatal(`file: ${fname},error: ${err} -12`);
                console.log(err);
                dbConnection.release();
              });
          }
        })
        .catch((err) => {
          logger.fatal(`file: ${fname},error: ${err} -13`);
          console.log(err);
        });
    }
    addListDetail();
  } catch (error) {
    console.log(error);
  }
};

const updListDetailToDb = (req, res) => {
  try {
    logger.trace(`file: ${fname},putMethod updListDetailToDb is called`);

    const listMstId = req.body.listMstId;
    const listDtlValue = req.body.listDtlValue;
    const listDtlDesc = req.body.listDtlDesc;
    const listDtlComment = req.body.listDtlComment;

    async function updListDetail() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          if (dbConnection) {
            await ExecuteQuery(
              dbConnection,
              `SELECT listdtlvalue FROM listdatadetail WHERE listmstid ='${listMstId}' AND listdtlvalue = '${listDtlValue}'`
            )
              .then(async (selectedmaster) => {
                if (selectedmaster.length != 0) {
                  await ExecuteQuery(
                    dbConnection,
                    `UPDATE listdatadetail SET listdtldesc = '${listDtlDesc}', listdtlcomment = '${listDtlComment}' WHERE listmstid = '${listMstId}' and listdtlvalue = '${listDtlValue}'`
                  )
                    .then((upddata) => {
                      logger.info(`file: ${fname} , statuscode : 200`);
                      var status = {
                        status: "success",
                        Message: `listDtlValue ${listDtlValue} updated successfully for master ${listMstId}!!`,
                      };
                      res.status(200).json(status);
                      dbConnection.release();
                    })
                    .catch((err) => {
                      logger.fatal(`file: ${fname},error: ${err} -14`);
                      res.status(500).json(err);
                      dbConnection.release();
                    });
                } else {
                  logger.info(`file: ${fname} , statuscode : 200`);
                  var status = {
                    Message: `listDtlValue ${listDtlValue} does not exist for master ${listMstId}`,
                  };
                  res.status(200).json(status);
                  dbConnection.release();
                }
              })
              .catch((err) => {
                logger.fatal(`file: ${fname},error: ${err} -15`);
                console.log(err);
                dbConnection.release();
              });
          }
        })
        .catch((err) => {
          logger.fatal(`file: ${fname},error: ${err} -16`);
          console.log(err);
        });
    }
    updListDetail();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  fetchAllListDetail,
  fetchListDetailByMasterId,
  deleteListDetailByListDtlId,
  addListDetailToDb,
  updListDetailToDb,
};