const { Connection, Request } = require("tedious");
//  var sql = require("mssql");
const sql = require("msnodesqlv8");

const connectionString = "server=JKTBLRCOM162;Database=Testapp;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";

// for(var i=990; i<=999; i++){
// const query = `UPDATE Questions_and_Answers SET ansId = '${i}' WHERE queandansId = '${i}'`;
// sql.query(connectionString, query, (err, rows)=>{
//   console.log(rows);
// })
// }
var query = "SELECT * FROM Assessment";

// Driver=msnodesqlv8;Server=(JKTBLRCOM162)\INSTANCE;Database=Testapp;UID=AD\Guruprasad.J;PWD=;Encrypt=false
//server=JKTBLRCOM162;Database=Testapp;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}
//Server=JKTBLRCOM162,1433;Database=Testapp;User Id=AD\Guruprasad.J;Password=;Encrypt=false;Trusted_Connection=Yes

sql.query(connectionString, query, (err, rows) => {
    console.log(rows);
    console.log(err);
})



// Create connection to database
// const config = {
//   authentication: {
//     options: {
//       userName: "AD\Guruprasad.J", // update me
//       // password: "",
//  // update me
//     },
//     type: "default",
//   },
//   server: "JKTBLRCOM162",
//   Trusted_Connection: "Yes",
//   Driver: "{SQL Server Native Client 11.0}", // update me
//   options: {
//     database: "Testapp",//update me
//     encrypt: false
//   },
// };

/* 
    //Use Azure VM Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        authentication: {
            type: 'azure-active-directory-msi-vm',
        },
        options: {
            database: process.env["db_database"],
            encrypt: true,
            port: 1433
        }
    };

    //Use Azure App Service Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        authentication: {
            type: 'azure-active-directory-msi-app-service',
        },
        options: {
            database: process.env["db_database"],
            encrypt: true,
            port: 1433
        }
    });

*/

// const connection = new Connection(config);

// // Attempt to connect and execute queries if connection goes through
//  connection.on("connect",  ( err) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//  queryDatabase();
// }

// });

// connection.connect();

//  function queryDatabase() {
//   console.log("Reading rows from the Table...");

//   // Read all rows from table
//   const request = new Request(
//     `SELECT * FROM Complexity`,
//     (err, rowCount) => {
//       if (err) {
//         console.error(err.message);
//       } else {
//         console.log(`${rowCount} row(s) returned`);
//       }
//       connection.close();
//     }
//   );

//   request.on("row", columns => {
//     columns.forEach(column => {
//       console.log("%s\t%s", column.metadata.colName, column.value);
//     });
//   });

//   connection.execSql(request);
// }

// function getData() {
//     // Create connection instance
//     var conn = new sql.ConnectionPool(config);
   
//     conn.connect()
//     // Successfull connection
//     .then(function () {
   
//       // Create request instance, passing in connection instance
//       var req = new sql.Request(conn);
   
//       // Call mssql's query method passing in params
//       req.query("SELECT TOP 5 * FROM QueandAns")
//       .then(function (recordset) {
//         console.log(recordset);
//         conn.close();
//       })
//       // Handle sql statement execution errors
//       .catch(function (err) {
//         console.log(err);
//         conn.close();
//       })
   
//     })
//     // Handle connection errors
//     .catch(function (err) {
//       console.log(err);
//       conn.close();
//     });
//    }
   
   
//    getData();
module.exports.connectionString = connectionString;