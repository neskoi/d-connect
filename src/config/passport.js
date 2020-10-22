const bcrypt = require('bcryptjs');
const tamer_controller = require('../../controllers/tamer');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){

  passport.use('local-signin', new LocalStrategy({  
    usernameField: 'login', 
    passwordField: 'pw'
  },
 
 async function(login, pw, done) { 
    let tamer = await tamer_controller.login(login);
    if (!tamer) {return done(null, false);}
    let hashed_password = bcrypt.compareSync(pw, tamer.pw);
    if (!hashed_password || tamer.active == 0 || tamer.banned == 1){return done(null, false)}
    return done(null, tamer.get());
  }));

  passport.serializeUser(function(tamer, done) { 
    done(null, tamer); 
  });

  passport.deserializeUser(function(tamer, done) { 
    done(null, tamer);
  });
}
