var express = require("express");
var router = express.Router();
const fs = require('fs');

var result;

async function readcsvFile() {
    let i = 0;
    var words = [];
    const data = fs.readFileSync("./logs/all-the-logs.log", 'utf8');
    result = data.split('\r\n');

    for (let j = 0; j < result.length; j++) {
        words[i] = result[j].split(' ');
        i++
    }
    console.log(i,"   --------i value  ");
    console.log(words[1][1] ,"from words");
    return words;
}
router.get('/', (req, res) => {
    res.render('logs');
 
})
router.post('/', async function (req, res) {
    var f = req.body.userSearchInput;
    var startdate =req.body.startdateInput;
    var enddate = req.body.enddateInput;
    console.log(f ," in post method");
    await readcsvFile().then(async(data)=>{
        await getLogs(data).then((logs)=>
        {
            console.log(logs,"logs found");
            res.render('logsFilter',
            {
                logrecords:logs,
            })
        })
        .catch((err)=>{
            console.log(err+1);
        })
    })
    .catch((err)=>{
        console.log(err+2);
    })
    async function getLogs(words){
        var logrecords = [];
        const item = "[" + f.toUpperCase()+ "]";
        console.log(item, "item to uppercase");
        for (let a = 0; a < words.length; a++) {

                var date=words[a][0].slice(1,-1).split('T')[0];
            if (words[a][1] == item && date >= startdate && date <= enddate) {
                logrecords[a]=words[a].join(' ');
            }

        }
        return logrecords;
    }
});

module.exports = router;