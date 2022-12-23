require('dotenv').config();
var mysql = require('mysql');
const  {Pool, Client}  = require('pg');
var pg = require('pg');

// const pool = mysql.createPool({
//     connectionLimit: process.env.DB_MAX_CONNECTION,
//     host: process.env.SERVER,
//     user: process.env.DB_USER,
//     password: process.env.DB_PWD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
//   });

  // try {
    
  //   pool.getConnection(function(err,conn) {
  //     if (err) throw err;
  //     console.log("Connected!");
  //     // console.log(conn);
  //     conn.query(`select * from complexity`, function (err, result, fields) {
  //       if (err) throw err;
  //       console.log("Result: " , result);
  //     //   console.log("Fields: ", fields);
  //     conn.release();
  //     });
  //   })
  // } catch (error) {
  //   console.log("Error", error);
  // }

  const pool = new Pool({
    max: 300,
    connectionTimeoutMillis: 5000,
  
    host: 'c.jkacademy.postgres.database.azure.com',
    port: 5432,
    user: 'citus',
    password: 'Jktech@123',
    database: 'citus',
    ssl: false,
  });

  // const pool = new Pool({
  //   max: 300,
  //   connectionTimeoutMillis: 5000,
  
  //   host: '13.67.139.47',
  //   user: 'uzamvvin',
  //   port: 5432,
  //   password: 'WenZEI1JAkkAkrSJKmGTl2AD4LXDEy6U',
  //   database: 'uzamvvin',
  //   ssl: false
  // });

 //uzamvvin:WenZEI1JAkkAkrSJKmGTl2AD4LXDEy6U@hansken.db.elephantsql.com/uzamvvin
  
  
  // pool.connect((err,conn)=>{
  //   if(err) throw err
  //   console.log(conn);
  //   conn.query(` DROP TABLE IF EXISTS pharmacy;
  //   CREATE TABLE pharmacy (pharmacy_id integer,pharmacy_name text,city text,state text,zip_code integer);
  //   INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (0,'Target','Sunnyvale','California',94001);
  //   INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (1,'CVS','San Francisco','California',94002);
  //   INSERT INTO pharmacy (pharmacy_id,pharmacy_name,city,state,zip_code) VALUES (2,'Walgreens','San Diego','California',94003);
  //   CREATE INDEX idx_pharmacy_id ON pharmacy(pharmacy_id);`,(err, result)=>{
  //     if(err){
  //       console.log(err);
  //     }
  //     console.log(result);
  //   })
  // })

  async function queryDatabase() {
    const queryString = `
      select * from players
    `;
  
    try {
  
      var res = await pool.query(queryString);
      console.log('executed query');
      console.log(res);
    } catch (err) {
      console.log(err.stack);
    } finally {
      pool.end();
    }
  }
  
  queryDatabase();

//   var conString = process.env.ELEPHANTSQL_URL || "uzamvvin:WenZEI1JAkkAkrSJKmGTl2AD4LXDEy6U@hansken.db.elephantsql.com/uzamvvin";

// var client = new pg.Client(conString);
// client.connect(function(err) {
//   if(err) {
//     return console.error('could not connect to postgres', err);
//   }
//   client.query('SELECT * from Players', function(err, result) {
//     if(err) {
//       return console.error('error running query', err);
//     }
//     console.log(result.rows[0].theTime);
//     //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
//     client.end();
//   });
// });

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
