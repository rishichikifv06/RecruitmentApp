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

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var qaManagerRouter = require('./routes/qaManager');
var assessmentManagerRouter = require('./routes/assessmentManager');
var profileManagerRouter = require('./routes/profileManager');
var quesManagerRouter = require('./routes/questionsManager');
var ansManagerRouter = require('./routes/answersManager');
var skillsManagerRouter = require('./routes/skillsManager');
var complexityManagerRouter = require('./routes/complexityManager');
var candidateManagerRouter = require('./routes/candidateManager');
var assessmentStagingManagerRouter = require('./routes/assessmentStagingManager');
var testRouter = require('./routes/test');
var cardsScoreManagerRouter = require('./routes/cardsScoreManager');


// initialize express
var app = express();

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


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/qaManager', qaManagerRouter);
app.use('/assessmentManager', assessmentManagerRouter );
app.use('/profileManager', profileManagerRouter);
app.use('/quesManager', quesManagerRouter);
app.use('/ansManager', ansManagerRouter);
app.use('/skillsManager', skillsManagerRouter);
app.use('/complexityManager', complexityManagerRouter);
app.use('/candidateManager', candidateManagerRouter);
app.use('/assessmentStagingManager', assessmentStagingManagerRouter);
app.use('/testManager', testRouter);
app.use('/cardsScoreManager', cardsScoreManagerRouter);
//app.use(dbRouter);


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