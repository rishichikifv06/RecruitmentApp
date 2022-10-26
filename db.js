//const { Connection, Request } = require("tedious");
var sql = require("mssql");


// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "v100", // update me
      password: "Vishwa@123" // update me
    },
    type: "default"
  },
  server: "test1sql.database.windows.net", // update me
  options: {
    database: "newSQL", //update me
    encrypt: true
  }
};

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
//     `SELECT TOP 5 * FROM [dbo].[QueandAns]`,
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
module.exports.config = config;