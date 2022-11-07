var express = require("express");
var router = express.Router();
var details = require("../db");
var sql = require("mssql");
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var app = express();
//const { Connection, Request } = require("tedious");
var jsonParser = bodyParser.json()


function authUser(req, res, next) {
  if (req.user == null) {
    res.status(403);
    return res.send("You need to sign in");
  }
  next();
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);
      return res.send("Not Allowed");
    }
    next();
  };
}

function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin'); // redirect to sign-in route
  }

  next();
};

// router.get("/", (req, res) => {
//  // res.send("Home Page of qaManager");
//  function getData() {
//   // Create connection instance
//   var conn = new sql.ConnectionPool(details.config);
 
//   conn.connect()
//   // Successfull connection
//   .then(function () {
 
//     // Create request instance, passing in connection instance
//     var req = new sql.Request(conn);
 
//     // Call mssql's query method passing in params
//     req.query("SELECT TOP 10 * FROM QueandAns")
//     .then(function (recordset) {
//       console.log(recordset);
//       res.send(recordset);
//       conn.close();
//     })
//     // Handle sql statement execution errors
//     .catch(function (err) {
//       console.log(err);
//       conn.close();
//     })
 
//   })
//   // Handle connection errors
//   .catch(function (err) {
//     console.log(err);
//     conn.close();
//   });
//  }
 
//  getData();
// });


router.get("/", (req, res) => {
  const data = {
     "data": [
      {Question:'What is COM?',
      Answer:'1. COM stands for Component Object Model. 2. COM is one of Microsoft Technology. Using this technology we can develop windows applications as well as web applications.'},
      {Question:'What are the disadvantages of COM?',
      Answer:'1. Incomplete object-oriented programming means it will not support all the features of OOPs. 2. Platform dependent means COM applications can run on only Windows OS.'},
      {Question:'What are the main reasons to use C# language?',
      Answer:'Easy to learn'},
      {Question:'What is the difference between public, static and void?',
      Answer:'You can access public declared variables anywhere in the application.'},
      {Question:'What are constructors in C#?',
      Answer:'A constructor is a member function in the class and has the same name as its class.'},
      {Question:'What are the different types of constructors in C#?',
      Answer:'Basically, there are five types of constructors:'},
      {Question:'What is static constructor?',
      Answer:'Static constructor is used to initialize static data members as soon as the class is referenced first time.'},
      {Question:'What is method overloading in C#?',
      Answer:'Method overloading is mechanism to create multiple methods with the same name and unique signature in the same class. '},
      {Question:'Is overriding of a function possible in the same class?',
      Answer:'No'},
      {Question:'What is array?',
      Answer:'Array is a set of related instances either value or reference types.'},
      {Question:'What is ArrayList?',
      Answer:'ArrayList is a dynamic array. You can add and remove the elements from an ArrayList at runtime. In the ArrayList, elements are not automatically sorted.'},
      {Question:'What is the difference between method overloading and method overriding in C#?',
      Answer:'Method parameters must be different in method overloading whereas it must be same in method overriding.'},
      {Question:'What is Hashtable?',
      Answer:'A Hashtable is a collection of key/value pairs. It contains values based on the key.'},
      {Question:'Can multiple catch blocks be executed?',
      Answer:'No, Multiple catch blocks of similar type canâ€™t be executed. Once the proper catch code executed, the control is transferred to the finally block, and then the code that'},
      {Question:'Explain types of comment in C# with examples',
      Answer:'Single line(//)  ii. Multiple line (/* */) iii. XML Comments (///).'},
      {Question:'What is an object?',
      Answer:'An object is an instance of a class through which we access the methods of that class. â€œNewâ€ keyword is used to create an object. A class that creates an object in '},
      {Question:'What is the difference between constants and read-only?',
      Answer:'Constant variables are declared and initialized at compile time. The value canâ€™t be changed afterward. Read-only is used only when we want to assign the value at run time.'},
      {Question:'What is method overloading?',
      Answer:'Method overloading is creating multiple methods with the same name with unique signatures in the same class. When we compile, the compiler uses overload resolution to '},
      {Question:'What is the difference between Array and Arraylist?',
      Answer:'In an array, we can have items of the same type only. The size of the array is fixed when compared. To an arraylist is similar to an array, but it doesnâ€™t have a fixed size.'},
      {Question:' Can a private virtual method can be overridden?',
      Answer:'No, because they are not accessible outside the class.'},
  ]
  }

  res.json(data);

});

router.post("/", jsonParser, (req, res) => {

  if(req.body != undefined){
      const id = req.body.id;
      const compId = req.body.compId;
      const skillId = req.body.skillId;

      function getData() {
          // Create connection instance
          var conn = new sql.ConnectionPool(details.config);
      
          conn
            .connect()
            // Successfull connection
            .then(function () {
              // Create request instance, passing in connection instance
              var req = new sql.Request(conn);
      
              // Call mssql's query method passing in params
              req
                .query(
                  `SELECT Question, Answer, queansId FROM QueandAns WHERE compId=${compId} AND skillId =${skillId}`
                )
                .then(function (recordset) {
                  console.log(recordset);
                  const{recordset: data} = recordset;
                   res.send(( data[id]));
                  conn.close();
                })
                // Handle sql statement execution errors
                .catch(function (err) {
                  console.log(err);
                  res.send(err);
                  conn.close();
                });
            })
            // Handle connection errors
            .catch(function (err) {
              console.log(err);
              res.send(err);
              conn.close();
            });
        }
      
        getData();


  }else{
      res.send("Error");
  }
});


router.post("/allQA", jsonParser, (req, res) => {

  if(req.body != undefined){
      const compId = req.body.compId;
      const skillId = req.body.skillId;

      function getData() {
          // Create connection instance
          var conn = new sql.ConnectionPool(details.config);
      
          conn
            .connect()
            // Successfull connection
            .then(function () {
              // Create request instance, passing in connection instance
              var req = new sql.Request(conn);
      
              // Call mssql's query method passing in params
              req
                .query(
                  `SELECT Question, Answer, queansId FROM QueandAns WHERE compId=${compId} AND skillId =${skillId}`
                )
                .then(function (recordset) {
                  console.log(recordset);
                  const{recordset: data} = recordset;
                  const jData = {data};
                   res.send(jData);
                  conn.close();
                })
                // Handle sql statement execution errors
                .catch(function (err) {
                  console.log(err);
                  res.send(err);
                  conn.close();
                });
            })
            // Handle connection errors
            .catch(function (err) {
              console.log(err);
              res.send(err);
              conn.close();
            });
        }
      
        getData();


  }else{
      res.send("Error");
  }
});

module.exports = router;
