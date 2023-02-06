const { ConnectToDb, ExecuteQuery } = require("../db");

exports.getcmpIdbyName = async (skilllevel) => {
  try {
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
            dbConnection.release();
            console.log(err);
            throw err;
          });
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
    return cmpid;
    
  } catch (err) {
    console.log("error in the Complexity_Repo getcmpIdbyName ", err);
    throw err;
  } 
};
