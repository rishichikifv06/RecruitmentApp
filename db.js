require('dotenv').config();
var mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 20,
    host: process.env.SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: process.env.PORT
  });

  
  pool.getConnection(function(err,conn) {
    if (err) throw err;
    console.log("Connected!");
    // console.log(conn);
    conn.query(`select * from complexity`, function (err, result, fields) {
      if (err) throw err;
      console.log("Result: " , result);
    //   console.log("Fields: ", fields);
    });
  })




module.exports.ConnectToDb = async () => {

    return new Promise((resolve,reject)=>{

        pool.getConnection(async (err,conn)=>{
        err ? reject(err) : resolve(conn)
    })
    })
  };
  
module.exports.ExecuteQuery = async (conn, queryString) => {
   return new Promise((resolve,reject)=>{
       
       conn.query(queryString, (err, data) => {
        err ? reject(err) : resolve(data)
}) 
});
  
}
