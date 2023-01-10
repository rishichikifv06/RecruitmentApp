var express = require("express");
var router = express.Router();

router.post('/uploadFile/', (req, res)=>{
    console.log(req.files);
    const fileName = req.files.file.name;
    console.log(fileName);
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    sampleFile = req.files.file;
    console.log(sampleFile);
    uploadPath = __dirname + '/downloads/' + sampleFile.name;
    console.log(uploadPath);
  
    sampleFile.mv(uploadPath, function(err) {
      if (err){
        console.log(err);
        return res.status(500).send(err);
      }
  
      res.send('File uploaded!');
    });
})

module.exports = router;

