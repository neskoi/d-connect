const express = require('express');
const router = express.Router();
const digivice_load = require('../controllers/digivice');
const controller =  require('../controllers/tamer');
const passport = require('passport');

const {logout} =  require('../controllers/tamer');

router.get('/login', function(req, res) {
  res.render('login', {js:['login.js']});
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local-signin', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/tamer/login'); }
    req.logIn(user, async function(err) {
      if (err) { return next(err); }  
      await digivice_load(req.user);
      return res.redirect('/tamer/digivice/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  logout(req.user);
  req.logOut();
  req.session.destroy();
  res.redirect('/login');
});

router.get('/digivice', function(req, res) {
  res.render('digivice', {css:['_digivice.css'], js:['digivice.js']});
}); 
  
router.get('/register', function(req, res) {    
  res.render('register',{css:['_register.css'], js:['register.js']});
});

router.post('/register', async function(req, res) {
  let register = await controller.tamer_register(req, res);
  if(register == true){
    res.redirect('/tamer/register/response?registered=true');
  }else{
    res.redirect('/tamer/register/response?error');
  }    
});

router.get('/register/response', function(req, res) {    
  if(req.get("Referer")){      
    res.render('register_response',{registered: req.query.registered});
  }else{
    res.redirect('/');
  }
});
  
router.post('/register/existencecheck', (req, res) => {
  controller.tamer_existence_check(req, res);
}) 

module.exports = router;
