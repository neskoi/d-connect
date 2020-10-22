var bcrypt = require('bcryptjs');

const tamer_repo = require('../repository/tamer');

exports.tamer_existence_check = async (req, res) =>{
  let json = {used: true};
  let tamer = await tamer_repo.select_tamer(req.body.login_email);
  if (!tamer) {
    res.send({response: false});
  }else{
    res.send({response: true});
  }
}

exports.login = async (login) => {
  let tamer = await tamer_repo.login(login);
  return tamer;
}

exports.info_load = async (tamer_id) => {
  let tamer = await tamer_repo.info_load(tamer_id);
  return tamer;
}

exports.tamer_register = async (req, res) => {
  req.body.firstname = req.body.firstname.replace(/\s\s+/g, ' ').trim().toLowerCase();
  req.body.lastname = req.body.lastname.replace(/\s\s+/g, ' ').trim().toLowerCase();
  req.body.login =  req.body.login.replace(/\s\s+/g, ' ').trim().toLowerCase();
  req.body.pw = bcrypt.hashSync(req.body.pw, 10);
  let tamer_check = await tamer_repo.select_tamer(req.body.login, req.body.email);
  let form_validation = (req.body.login.length < 3 || req.body.login.length > 20) || req.body.pw.length < 8 || new Date() < new Date(Date.parse(req.body.born_date)) || tamer_check;
  if(form_validation) return false;

  let new_tamer = await tamer_repo.register_tamer(req.body);
  
  if(new_tamer) return true;
  return false;
}

exports.logout = (tamer) => {
  PVP_POOL.forEach(element => {
    if(typeof element[tamer.login] !== 'undefined'){
      delete element[tamer.login];
    }
  });
  TAMER_LIST[tamer.login].pendulum.end_pendulum(TAMER_LIST[tamer.login].digimons);
  /* full_save(tamer);
  digimons_save(TAMER_LIST[tamer.login].digimons); */
  delete TAMER_LIST[tamer.login];
}