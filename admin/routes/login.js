var express = require('express');
var router = express.Router();

const bcrypt = require("bcrypt");

const sequelize = require('../models/index.js').sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);


router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/validate', async function(req, res, next) {

  let { user, password } = req.body

  let userdb = await models.users.findOne({
    where: {
      username: user
    } 
  })

  let valid = await bcrypt.compare(password, userdb.password);

  if(valid) {
    req.session.user = user;  

    let tracing = req.cookies.tracing  || ''
    if(tracing.length > 0)
      res.redirect(tracing)   
    else
      res.redirect('/');

      
  } else {  
    res.redirect('/login'); 
  }

});

router.get('/invalidate', function(req, res, next) { 
  req.session.destroy();
  res.redirect('/login')
});

module.exports = router;
