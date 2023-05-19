const {configure, getLogger, shutdown } =require('log4js');
const path = require('path');

configure({
    appenders:{
        out:{type:'stdout'},
        file:{type: 'file',filename:'./logs/all-the-logs.log',
        layout: { type: 'basic' },
        compress: true,
        daysToKeep: 14,
        keepFileExt: true},
        server:{type: 'tcp-server',host:'localhost',port:5000},
    },
    categories:{
        default:{
            appenders:['file','out'],
            level:'debug'
        }
    }
})

const fileNanme = async (filename) => {
    const currentfilename = path.basename(filename);
    return currentfilename;
}

const logger = getLogger();

module.exports = {
    fileNanme,
    logger
}


