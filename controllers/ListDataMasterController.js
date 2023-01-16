const { ConnectToDb, ExecuteQuery } = require("../db");
const { fileNanme, logger } = require("../log4");

var fname;

fileNanme(__filename).then((data) => {
  fname = data;
});

const ListDataValues = (req, res, next) => {
  try {
    logger.trace(`file: ${fname},getMethod getListDataMaster is called`);
    async function getListData() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          await ExecuteQuery(dbConnection, `select * from listdatamaster`)
            .then((result) => {
              logger.info(`file: ${fname} , statuscode : 200`);
              res.status(200).json({
                Status: {
                  StatusCode: 200,
                  StatusType: "Success",
                  StatusMessage: "Record Found",
                  StatusSeverity: "Information",
                },
                result,
              });
              dbConnection.release();
            })
            .catch((err) => {
              logger.fatal(`file: ${fname},error: ${err} -1`);
              res.status(500).json({ err });
              dbConnection.release();
            });
        })
        .catch((err) => {
          logger.fatal(`file: ${fname},error: ${err} -2`);
          res.status(500).json({ err });
          // dbConnection.release();
        });
    }
    getListData();
  } catch (err) {
    logger.fatal(`file: ${fname},error: ${err} -3`);
  }
};

const postListData = (req, res, next) => {
  try {
    logger.trace(`file: ${fname},postMethod postListDatamaster is called`);

    const listDescValue = req.body.listdesc;
    const listcodevalue = req.body.listcode;
    async function postDataValue() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          await ExecuteQuery(
            dbConnection,
            `INSERT INTO listdatamaster(listcode,listdesc) VALUES ('${listcodevalue}','${listDescValue}')`
          )
            .then((result) => {
              logger.info(`file: ${fname} , statuscode : 200`);
              res.status(200).json({
                Status: {
                  StatusCode: 200,
                  StatusType: "Success",
                  StatusMessage: "Data Inserted Successfully",
                },
              });
              dbConnection.release();
            })
            .catch((err) => {
              logger.fatal(`file: ${fname},error: ${err} -4`);
              res.status(500).json({ err });
              // dbConnection.release();
            });
        })
        .catch((err) => {
          logger.fatal(`file: ${fname},error: ${err} -5`);
          res.status(500).json({ err });
          // dbConnection.release();
        });
    }
    postDataValue();
  } catch (err) {
    logger.fatal(`file: ${fname},error: ${err} -6`);
  }
};

const getMasterDataByCode = (req, res, next) => {
  try {
    logger.trace(`file: ${fname},getMethod getSingleListDataMaster is called`);

    const masterid = req.params.masterid;
    async function getSingleData() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          await ExecuteQuery(
            dbConnection,
            `SELECT * FROM listdatamaster where listmstid ='${masterid}'`
          )
            .then(async (listdatamaster) => {
              if (listdatamaster.length == 0) {
                var status = {
                  Message: "The entered masterID is not present",
                };
                logger.info(`file: ${fname} , statuscode : 200`);
                res.status(200).json(status);
                dbConnection.release();
              } else {
                var status = {
                  status: "success",
                  Message: `Data fetched successfully!!`,
                  result: listdatamaster,
                };
                logger.info(`file: ${fname} , statuscode : 200`);
                res.status(200).json(status);
                // console.log(status);
                dbConnection.release();
              }
            })
            .catch((err) => {
              logger.fatal(`file: ${fname},error: ${err} -7`);
              res.status(500).json({err});
              // dbConnection.release();
            });
        })
        .catch((err) => {
          logger.fatal(`file: ${fname},error: ${err} -8`);
          // dbConnection.release();
        });
    }
    getSingleData();
  } catch (err) {
    logger.fatal(`file: ${fname},error: ${err} -9`);
  }
};

const updateDataMaster = (req, res, next) => {
  const masterid = req.body.masterid;
  const listcode = req.body.listcode;
  const listdesc = req.body.listdesc;
  console.log(masterid,listcode)
  try {
    logger.trace(`file: ${fname},updateMethod updateListDataMaster is called`);

    async function updateRecord() {
      await ConnectToDb().then(async (dbConnection) => {
        await ExecuteQuery(
          dbConnection,
          `SELECT * FROM listdatamaster where listmstid ='${masterid}'`
        )
          .then(async (listdatamaster) => {
            if (listdatamaster.length == 0) {
              var status = {
                Message: "The entered masterID is not present",
              };
              res.status(200).json(status);
              dbConnection.release();
            } else {
              await ExecuteQuery(
                dbConnection,
                `UPDATE listdatamaster SET listcode = '${listcode}',listdesc = '${listdesc}' WHERE listmstid = '${masterid}'`
              )
                .then((result) => {
                  var status = {
                    status: "success",
                    Message: `Data updated successfully!!`,
                  };
                  logger.info(`file: ${fname} , statuscode : 200`);

                  res.status(200).json(status);
                  // console.log(status);
                  dbConnection.release();
                })
                .catch((err) => {
                  logger.fatal(`file: ${fname},error: ${err} -10`);
                  res.status(500).json({err});
                  dbConnection.release();
                });
            }
          })
          .catch((err) => {
            logger.fatal(`file: ${fname},error: ${err} -11`);
            dbConnection.release();
          });
      });
    }
    updateRecord();
  } catch (err) {
    logger.fatal(`file: ${fname},error: ${err} -12`);
    // dbConnection.release();
  }
};

const deleteMasterData = (req, res, next) => {
  try {
    logger.trace(`file: ${fname},deleteMethod deleteListDataMaster is called`);
    const masterId = req.params.masterId;
    async function deleteData() {
      await ConnectToDb()
        .then(async (dbConnection) => {
          if (dbConnection) {
            await ExecuteQuery(
              dbConnection,
              `DELETE FROM listdatadetail WHERE listdatadetail.listdtlid = '${masterId}'`
              ).then(async (listdatamaster) => {
               {
                await ExecuteQuery(
                  dbConnection,
                  `DELETE FROM listdatamaster WHERE listmstid = ${masterId}`
                )
                  .then((result) => {
                    var status = {
                      status: "success",
                      Message: `Deleted successfully!!`,
                    };
                    logger.info(`file: ${fname} , statuscode : 200`);

                    res.status(200).json(status);
                    // console.log(status);
                    dbConnection.release();
                  })
                  .catch((err) => {
                    logger.fatal(`file: ${fname},error: ${err} -13`);
                    res.status(500).json({err});
                    dbConnection.release();
                  });
              }
            });
          }
        })
        .catch((err) => {
          logger.fatal(`file: ${fname},error: ${err} -14`);
          // dbConnection.release();
        });
    }
    deleteData();
  } catch (err) {
    logger.fatal(`file: ${fname},error: ${err} -15`);
  }
};

module.exports = {
  ListDataValues,
  postListData,
  getMasterDataByCode,
  updateDataMaster,
  deleteMasterData,
};