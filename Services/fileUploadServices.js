const path = require('path');
const ComplexityRepo = require('../DataBase/Complexity_Repo')
const SkillsRepo = require('../DataBase/Skills_Repo')
const candidatesRepo = require('../DataBase/Candidates_Repo')

exports.validateProfiles = async (profilesArray,result) => {
  try {
    var errRowCount = 0;
    var errorArray = [];
    var result = {}
    for (let i = 0; i < profilesArray.length; i++) {
      const skill = await SkillsRepo.getSkillIdBySkill(profilesArray[i].Skill);
      const complexityid = await ComplexityRepo.getcmpIdbyName(profilesArray[i].Complexity);

      //check if rows are empty and has valid skilllevel and complexity
      if (Object.keys(profilesArray[i]).length != 6) {
        const errorObj = {
          LineNum: i + 1,
          Error: `More or Less fields than required!!`,
        };
        errorArray.push(errorObj);
        errRowCount++;
      } else if (
        profilesArray[i].canName.length === 0 ||
        profilesArray[i].canPhone.length === 0 ||
        profilesArray[i].canExperience.length === 0 ||
        profilesArray[i].EmailId.length === 0 ||
        profilesArray[i].Skill.length === 0 ||
        profilesArray[i].Complexity.length === 0
      ) {
        const errorObj = {
          LineNum: i + 1,
          Error: `Please Enter All the fields!!`,
        };
        errorArray.push(errorObj);
        errRowCount++;
      } else if (skill == undefined || complexityid == undefined) {
        const errorObj = {
          LineNum: i + 1,
          Error: `Please enter valid Skill or Complexity!!`,
        };
        errorArray.push(errorObj);
        errRowCount++;
      }
      else{
        const candid = await candidatesRepo.getCandidateByEmail(profilesArray[i]);
        if(candid > 0){
          const errorObj = {
            LineNum: i + 1,
            Error: `Profile already exists!!`,
          };
          errorArray.push(errorObj);
          errRowCount++;
        }
      }
    }
    result.errorcount = errRowCount;
    result.errorArray = errorArray;
    return result;
  } catch (err) {
    console.log("Erro while validating profile", err);
    throw err;
  }
};

exports.getErrorPath = async (filePath) => {
try{
    const extension = path.extname(filePath);
    const filename = path.basename(filePath, extension);
    const errFileName = path.join(__dirname,"..","ErrorFiles","Error_" + filename + ".json");

    return errFileName;
}
catch(err){
    console.log("Erro while getErroPath", err);
    throw err;
}
}