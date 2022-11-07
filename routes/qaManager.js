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
      {Question:'What is garbage collection in C#?',
      Answer:'Automatic memory management is made possible by Garbage Collection in .NET Framework. When a class object is created at runtime, certain memory space is allocated to it in the heap memory. However, after all the actions related to the object are completed in the program, the memory space allocated to it is a waste as it cannot be used. In this case, garbage collection is very useful as it automatically releases the memory space after it is no longer required.'},
      {Question:'Why are Async and Await used in C#?',
      Answer:'Asynchronous programming processes execute independently of the primary or other processes. Asynchronous methods in C# are created using the Async and Await keywords.'},
      {Question:'What is meant by an Abstract Class?',
      Answer:"'It's a type of class whose objects can't be instantiated, and it's signified by the term 'abstract'. It consists of a methodology or a single approach.'"},
      {Question:'What is the difference between static, public, and void?',
      Answer:'Public declared variables can be accessed from anywhere in the application. Static declared variables can be accessed globally without needing to create an instance of the class. Void is a type modifier which states the method and is used to specify the return type of a method in C#.'},
      {Question:'What is a Virtual Method in C#?',
      Answer:'In the parent class, a virtual method is declared that can be overridden in the child class. We construct a virtual method in the base class using the virtual keyword, and that function is overridden in the derived class with the Override keyword.'},
      {Question:'Differentiate between finalize blocks and finalize.',
      Answer:'Once the try and catch blocks have been completed, the finalize block is called since it is used for exception handling. No matter if the exception has been captured, this block of code is run. In general, the code in this block is cleaner.'},
      {Question:'What are sealed classes in C#?',
      Answer:'When a restriction needs to be placed on the class that needs to be inherited, sealed classes are created. In order to prevent any derivation from a class, a sealed modifier is used. Compile-time error occurs when a sealed class is forcefully specified as a base class.'},
      {Question:'What is Boxing and Unboxing in C#? ',
      Answer:'Boxing and unboxing is an important concept in C#. C# Type System contains three data types: Value Types (int, char, etc), Reference Types (object), and Pointer Types. Basically, it converts a Value Type to a Reference Type, and vice versa. Boxing and Unboxing enable a unified view of the type system in which a value of any type can be treated as an object.'},
      {Question:'What happens if the method names in the inherited interfaces conflict?',
      Answer:"'A problem could arise when the methods from various interfaces expect different data. But when it comes to the compiler itself, there shouldnt be an issue.'"},
      {Question:'What is Thread Pooling in C#?',
      Answer:"'In C#, a Thread Pool is a group of threads. These threads are used to do work without interfering with the principal thread's operation.'"},
      {Question:'What is ArrayList?',
      Answer:'ArrayList is a dynamic array. You can add and remove the elements from an ArrayList at runtime. In the ArrayList, elements are not automatically sorted.'},
      {Question:'What is the difference between method overriding and method overloading?',
      Answer:'In method overriding, the relevant method definition is replaced in the derived class, which changes the method behavior. When it comes to method overloading, a method is created with the same name and is in the same class while having different signatures.'},
      {Question:'What are User Control and Custom Control?',
      Answer:'Custom Controls are produced as compiled code. These are easy to use and can be added to the toolbox. Developers can drag and drop these controls onto their web forms. User Controls are almost the same as ASP include files. They are also easy to create. User controls, however, can’t be put in the toolbox. They also can’t be dragged and dropped from it.'},
      {Question:'Can multiple catch blocks be executed?',
      Answer:'No, Multiple catch blocks of similar type cannot be executed. Once the proper catch code executed, the control is transferred to the finally block, and then the code that'},
      {Question:' What is an interface class? ',
      Answer:'An interface class is an abstract class with only public abstract methods. Only declaration is there in these methods, but not the definition. They must be implemented in the inherited classes.'},
      {Question:'What is an object?',
      Answer:'An object is an instance of a class through which we access the methods of that class.keyword is used to create an object. A class that creates an object in '},
      {Question:'What is the difference between constants and read-only?',
      Answer:'Constant variables are declared and initialized at compile time. The value canâ€™t be changed afterward. Read-only is used only when we want to assign the value at run time.'},
      {Question:'What is method overloading?',
      Answer:'Method overloading is creating multiple methods with the same name with unique signatures in the same class. When we compile, the compiler uses overload resolution to '},
      {Question:'What is the difference between Array and Arraylist?',
      Answer:'In an array, we can have items of the same type only. The size of the array is fixed when compared. To an arraylist is similar to an array, but it doesnâ€™t have a fixed size.'},
      {Question:'What are reference types and value types?',
      Answer:'A value type holds a data value inside its memory space. Reference type, on the other hand, keeps the objects address where the value is stored. It is, essentially, a pointer to a different memory location.'},
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
