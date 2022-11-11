var express = require("express");
var router = express.Router();
var sql = require("msnodesqlv8");
var details = require("../db");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

// router.get("/", (req, res) => {
//   async function getData() {
//     await sql.open(details.connectionString, async (err, conn) => {
//       await conn.query(
//         `select Candidates.canId,Candidates.canName,Candidates.canPhone,Candidates.canExperience,Candidates.Date,Candidates.Candidatestatus,Skill.skillName,Complexity.Name from CandidateSkills left join Complexity on Complexity.cmpId=CandidateSkills.cmpId left join Skill on CandidateSkills.skillId = Skill.skilId left join Candidates on CandidateSkills.canId= Candidates.canId where Candidates.Candidatestatus='Open' or Candidates.Candidatestatus='Pending' `,
//         (err, data) => {
//           if (data) {
//             console.log(data);
//             var record = [];
//             for(var i=0; i<data.length; i++)
//             {
//               for(var j=1; j<data.length; j++)
//               {
//                 if(data[i].canId === data[j].canId)
//                 {
//                   var result= {
//                     canId: data[i].canId,
//                     canName: data[i].canName,
//                     canPhone: data[i].canPhone,
//                     canExperience: data[i].canExperience,
//                     Date: data[i].Date,
//                     Candidatestatus: data[i].Candidatestatus,
//                     skillName: [data[i].skillName],
//                     complexity: [data[i].Name]
//                   }
//                   record[i] = result;
//                 }
//               }
//             }

//             console.log(record);
            
//           }
//           if (err) {
//             console.log(err);
//             res.send(err);
//           }
//         }
//       );
//       if (err) {
//         console.log(err);
//         res.send(err);
//       }
//     });
//   }

//   getData();
// });


// router.get("/", (req, res)=>{
 
// var data = [
//   {
//     canId: 1,
//     canName: "Vishwas",
//     canPhone: 9739130703,
//     Email: "vishwas@jk.com",
//     canExperience: 1,
//     Date: "2022-11-14",
//     Candidatestatus: "Open",
//     skills: [
//           {
//             skill: "Angular",
//             complexity: "Easy"
//           },
//           {
//             skill: "React",
//             complexity: "Medium"
//           }
//     ]
// },
// {
//   canId: 2,
//   canName: "Guru",
//   canPhone: 9793430743,
//   Email: "guru@jk.com",
//   canExperience: 1,
//   Date: "2022-11-14",
//   Candidatestatus: "Open",
//   skills:
//     [
//         {
//           skill: "c#",
//           complexity: "Easy"
//         },
//         {
//           skill: "Angular",
//           complexity: "Medium"
//         }
//     ]
// },
// {
//   canId: 3,
//   canName: "Pavani",
//   canPhone: 9793430743,
//   Email: "pavani@jk.com",
//   canExperience: 1,
//   Date: "2022-11-14",
//   Candidatestatus: "Open",
//   skillName: [
//         {
//           skill: "React",
//           complexity: "Easy"
//         },
//         {
//           skill: "OOPS",
//           complexity: "Medium"
//         }
//       ]
// },
// {
//   canId: 4,
//   canName: "Abhishek",
//   canPhone: 9793430743,
//   Email: "abhishek@jk.com",
//   canExperience: 1,
//   Date: "2022-11-14",
//   Candidatestatus: "Open",
//   skills: [
//         {
//           skill: "Angular",
//           complexity: "Easy"
//         },
//         {
//           skill: "React",
//           complexity: "Medium"
//         },
//         {
//           skill: "OOPS",
//           complexity: "Hard"
//         }
//       ]
// },
// {
//   canId: 5,
//   canName: "Purushottam",
//   canPhone: 9793430743,
//   Email: "purushottam@jk.com",
//   canExperience: 1,
//   Date: "2022-11-14",
//   Candidatestatus: "Open",
//   skills: [
//         {
//           skill: "Angular",
//           complexity: "Easy"
//         },
//         {
//           skill: "React",
//           complexity: "Medium"
//         }
//       ]
// },
// {
//   canId: 6,
//   canName: "Priyanka",
//   canPhone: 9793456443,
//   Email: "priyanka@jk.com",
//   canExperience: 1,
//   Date: "2022-11-14",
//   Candidatestatus: "Open",
//   skills: [
//         {
//           skill: "Angular",
//           complexity: "Easy"
//         },
//         {
//           skill: "C#",
//           complexity: "Medium"
//         }
//       ]
// },
// {
//   canId: 7,
//   canName: "Purushottam",
//   canPhone: 9793430743,
//   Email: "purushottam@jk.com",
//   canExperience: 1,
//   Date: "2022-11-14",
//   Candidatestatus: "Open",
//   skills: [
//         {
//           skill: "Angular",
//           complexity: "Easy"
//         },
//         {
//           skill: "React",
//           complexity: "Medium"
//         }
//       ]
// },
// {
//   canId: 8,
//   canName: "Purushottam",
//   canPhone: 9793430743,
//   Email: "purushottam@jk.com",
//   canExperience: 1,
//   Date: "2022-11-14",
//   Candidatestatus: "Open",
//   skills: [
//         {
//           skill: "Angular",
//           complexity: "Easy"
//         },
//         {
//           skill: "React",
//           complexity: "Medium"
//         }
//       ]
// },
// ]
 
// var result = {data};

// res.status(200).json(result);
// })

var result=[];
router.get("/", (req, res)=>{

   function getData() { 
    
     sql.open(details.connectionString, (err, conn) => {
      conn.query(
        `select canId,canName,canPhone,canExperience,
        Date,Candidatestatus 
        from Candidates 
        where Candidatestatus='Open' or Candidatestatus='Pending' `,
         (err, data) => {
          if (data) {
            
            var record={}
            //console.log(data);
            var i=0;
             for (let item of data)
            {
              //console.log(item);
              var id = item.canId;
              
               conn.query(`select Skill.skillName,Complexity.Name from CandidateSkills 
              left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity 
              on  Complexity.cmpId =CandidateSkills.cmpId where CandidateSkills.canId = '${id}'
              `,(err,val)=>{
                if(val){
                  
                  const arr = [...val];
                  item.skills = arr;
                  result.push(item);
                  console.log(item);
                   
                  // record={
                  //   canId : item.canId,
                  //   canName:item.canName,
                  //   canPhone:item.canPhone,
                  //   canExperience :item.canExperience,
                  //   Date:item.Date,
                  //   Candidatestatus:item.Candidatestatus,
                  //   skills: arr
                    
                  // }
                  // console.log(record)
                  // result[i] = record;
                  // i++;
                 
                }
                if(err){
                  console.log(err);
                }
              });
            
              console.log(result)
            }
            var output = {result};
            res.status(200).json(output);
          }
          if (err) {
            console.log(err);
            res.send(err);
          }
          
          
        }
      );
      if (err) {
        console.log(err);
        res.send(err);
      }
    });
  }

  getData();
})

// var result2 = [];
// router.get("/", (req, res) => {
// var result1;
// async function getData() { 
    
//   await sql.open(details.connectionString, async (err, conn) => {
//     await conn.query(
//       `select canId,canName,canPhone,canExperience,
//       Date,Candidatestatus 
//       from Candidates 
//       where Candidatestatus='Open' or Candidatestatus='Pending' `,
//       async(err, data) => {
//         if(data){
//           result1=data;
//           var a = await getSkills(result1);
//           console.log(a);
//           res.status(200).json(a);
//         }
//         if(err){
//           console.log(err);
//         }
//       })
//       if(err){
//         console.log(err);
//       }
//     })
//   }
//   getData();
// })

//   async function getSkills(result1){

//     var record = {};
//     var i = 0;
//     for(let item of result1){
//       var id = item.canId;
              
//       await sql.open(details.connectionString, async (err, conn) => {
//               await conn.query(`select Skill.skillName,Complexity.Name from CandidateSkills 
//               left join Skill on Skill.skillId=CandidateSkills.skillId left join Complexity 
//               on  Complexity.cmpId =CandidateSkills.cmpId where CandidateSkills.canId = '${id}'
//               `,(err,val)=>{
//                 if(val){
//                   var [...arr]= val;

//                   record={
//                     canId : item.canId,
//                     canName:item.canName,
//                     canPhone:item.canPhone,
//                     canExperience :item.canExperience,
//                     Date:item.Date,
//                     Candidatestatus:item.Candidatestatus,
//                     skills: [...arr]
                    
//                   }

//                   result2[i] = record;
//                   i++;
//                   console.log(result2);
//                 }
//                 if(err){
//                   console.log(err);
//                 }
//               })
//               if(err){
//                 console.log(err);
//               }
//             })
//     }
//     var output = {result2}
//     return output;
//   }



      


module.exports = router;
