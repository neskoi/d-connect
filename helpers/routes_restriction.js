module.exports = {
  is_logged: (req, res, next) =>{
    if(!req.isAuthenticated() && (req.originalUrl.startsWith('/tamer/login') || req.originalUrl.startsWith('/tamer/register'))){
      console.log('Liberado - route restriction');
      return next();
    }else if(req.isAuthenticated() && !(req.originalUrl.startsWith('/tamer/login') || req.originalUrl.startsWith('/tamer/register'))){
      console.log('Liberado - route restriction');
      return next();
    }else{
      console.log('Barrado - route restriction');
      res.redirect('/');
    }
  }
}