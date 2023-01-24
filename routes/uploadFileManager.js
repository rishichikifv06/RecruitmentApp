var express = require("express");
var router = express.Router();
var path = require('path');
const { skillsUpload, profileUpload } = require('../controllers/uploadsFileController');

router.post('/uploadSKills', skillsUpload);

router.post('/uploadProfile', profileUpload);

router.post('/uploadFile/', (req, res)=>{
    console.log(req.files);

    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    sampleFile = req.files.file;
    console.log(sampleFile);
    uploadPath = path.join(__dirname, '..', 'downloads', sampleFile.name)
    console.log(uploadPath);
  
    sampleFile.mv(uploadPath, function(err) {
      if (err){
        console.log(err);
        return res.status(500).send(err);
      }
  
      res.status(200).json({Message: `File uploaded!`});
    });
})

module.exports = router;

