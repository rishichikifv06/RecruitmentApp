/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config();

var path = require('path');
var express = require('express');
var session = require('express-session');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const passport = require("passport");

var qaManagerRouter = require('./routes/qaManager');
var assessmentManagerRouter = require('./routes/assessmentManager');
var skillsManagerRouter = require('./routes/skillsManager');
var complexityManagerRouter = require('./routes/complexityManager');
var candidateManagerRouter = require('./routes/candidateManager');
var assessmentStagingManagerRouter = require('./routes/assessmentStagingManager');
var randomizationManagerRouter = require('./routes/randomizationManager');
var cardsScoreManagerRouter = require('./routes/cardsScoreManager');
var cardsFilterManagerRouter = require('./routes/cardsFilterManager');
var candidateInterviewManagerRouter = require('./routes/candidateInterviewManager');
var interviewFilterManagerRouter = require('./routes/interviewFilterManager');
const { bearerStrategy } = require('./authorize');


// initialize express
var app = express();

app.use(passport.initialize());
passport.use(bearerStrategy);

app.use(cors(
  origin="*"
))


// app.use((req, res, next)=>{
//   res.header('Access-Control-Allow-Origin','*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   if(req.method === 'Options'){
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
//     return res.status(200).json({});
//   }
//   next();
// });


/**
 * Using express-session middleware for persistent user session. Be sure to
 * familiarize yourself with available options. Visit: https://www.npmjs.com/package/express-session
 */




app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // set this to true on production
  }
}));

app.use('/qaManager', qaManagerRouter);
app.use('/assessmentManager', assessmentManagerRouter );
app.use('/skillsManager', skillsManagerRouter);
app.use('/complexityManager', complexityManagerRouter);
app.use('/candidateManager', candidateManagerRouter);
app.use('/assessmentStagingManager', assessmentStagingManagerRouter);
app.use('/randomizationManager', randomizationManagerRouter);
app.use('/cardsScoreManager', cardsScoreManagerRouter.router);
app.use('/cardsFilterManager', cardsFilterManagerRouter);
app.use('/candidateInterviewManager', candidateInterviewManagerRouter);
app.use('/interviewFilterManager', interviewFilterManagerRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;