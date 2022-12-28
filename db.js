require('dotenv').config();
var mysql = require('mysql');
const  {Pool, Client}  = require('pg');
var pg = require('pg');



const pool = new Pool({
  max: process.env.DB_MAX_CONNECTION,
  connectionTimeoutMillis: process.env.DB_TIMEOUT,
  host: process.env.SERVER,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  ssl: true
});

// const pool = new Pool({
//   max: 10,
//   // connectionTimeoutMillis: process.env.DB_TIMEOUT,
//   host: 'suleiman.db.elephantsql.com',
//   port: 5432,
//   user: 'irbkkeaa',
//   password: 'QGEPGmg71jHbcQ7u7zpjtI0KiOxQ_sIS',
//   database: 'irbkkeaa',
//   ssl: false
// });

// const client = new Client({
//   // connectionTimeoutMillis: process.env.DB_TIMEOUT,
//   host: 'suleiman.db.elephantsql.com',
//   port: 5432,
//   user: 'irbkkeaa',
//   password: 'QGEPGmg71jHbcQ7u7zpjtI0KiOxQ_sIS',
//   database: 'irbkkeaa',
//   ssl: false
// })

async function queryDatabase() {
  
  try {

    pool.connect().then((conn)=>{
      conn.query(`select * from complexity`).then((result)=>{
        console.log(result.rows);
      }).catch((err)=>{
        console.log(err);
      })
    }).catch((err)=>{
      console.log(err);
    })
  } catch (err) {
    console.log("Error1",err.stack);
  }
}

queryDatabase();
  // async function queryDatabase() {
  
  //   try {
  
  //     pool.connect().then((conn)=>{
  //       conn.query(`SELECT NOW() AS "theTime"`).then((result)=>{
  //         console.log(result.rows);
  //       }).catch((err)=>{
  //         console.log(err);
  //       })
  //     }).catch((err)=>{
  //       console.log(err);
  //     })
  //   } catch (err) {
  //     console.log("Error1",err.stack);
  //   }
  //   finally{
  //     pool.end();
  //   }
  // }
  // queryDatabase();


module.exports.ConnectToDb = async () => {

    return new Promise((resolve,reject)=>{

        pool.connect(async (err,conn)=>{
        err ? reject(err) : resolve(conn)
    })
    })
  };
  
module.exports.ExecuteQuery = async (conn, queryString) => {
   return new Promise((resolve,reject)=>{
       
       conn.query(queryString, (err, data) => {
        err ? reject(err) : resolve(data.rows)
}) 
});
  
}
