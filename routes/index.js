/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  console.log(req.session)
  res.status(200).json({ 
        title: 'Recruitment App',
         isAuthenticated: req.session.isAuthenticated,
         username: req.session.account?.username,});
  // ( {

  //       title: 'Recruitment App',
  //       isAuthenticated: req.session.isAuthenticated,
  //       username: req.session.account?.username,
  //   });
});

module.exports = router;
