require('dotenv').config();
var mysql = require('mysql');
const  {Pool, Client}  = require('pg');
var pg = require('pg');


const config = {
  max: process.env.DB_MAX_CONNECTION,
  connectionTimeoutMillis: process.env.DB_TIMEOUT,
  host: process.env.SERVER,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  ssl: true
}


const pool = new Pool(config);

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


const ConnectToDb = async () => {

    return new Promise((resolve,reject)=>{

      try {
        
        pool.connect(async (err,conn)=>{
        err ? reject(err) : resolve(conn)
  
      })
      } catch (error) {
        console.log(error);
      }
    })
  };
  
const ExecuteQuery = async (conn, queryString) => {
   return new Promise((resolve,reject)=>{

    try {
      
      conn.query(queryString, (err, data) => {
      err ? reject(err) : resolve(data.rows)
  })
    } catch (error) {
      console.log(error);
    }
       
});
  
}

module.exports = {
  ConnectToDb,
  ExecuteQuery
}