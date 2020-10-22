const database = require('../src/database/index');
const {Op} = require('sequelize');
const {Background, Tamer_Background, Tamer, Tamer_Config, Language,Tamer_Title, Tamer_Skin} = database.models;

const {ramdom} = require('../util/util');

//Insert

exports.register_tamer = async (tamer) => {
  try {
    let new_tamer = await Tamer.create({
      fk_tamer_language: tamer.language,
      firstname: tamer.firstname,
      lastname: tamer.lastname,
      gender: tamer.gender,
      born_date: tamer.born_date,
      login: tamer.login,
      email: tamer.email,
      pw: tamer.pw
    });
    console.log('A new tamer has arrived.');
    return new_tamer;

  } catch (error) {
    console.log(error);
  }
}

exports.language_id_get = async (language) => {
  try {
    let lang = await Language.findOne({where:{short:language}, raw: true});
    return lang.id;
  } catch (error) {
    
  }
}

//Selects
exports.select_tamer = async (login_email) => {
  let tamer =  await Tamer.findOne({
    attributes: ['login', 'email'],      
    where: {
    [Op.or]: 
      [{ login: login_email},
      { email: login_email}]
  }});
  return tamer;
}

exports.login = async (login) => {
  let tamer = await Tamer.findOne({
    attributes:['id', 'login', 'pw', 'fk_tamer_language'],
    where: {
      [Op.or]: 
      [{ login: login }, 
       { email: login }]
    },
  });
  return tamer;
}

exports.info_load = async (tamer_id) => {
  let tamer = await Tamer_Config.findOne({
    raw:true,
    where: {fk_tamer_config_tamer: tamer_id},
    include: [
      {
        model:Tamer_Title,
        attributes: [],
        where:{fk_tamer_title_tamer: tamer_id},
        include: 'Title',
        required:false
      },
      {
        model:Tamer_Skin,
        attributes: [],
        where:{fk_tamer_skin_tamer: tamer_id},
        include: 'Skin',
        required:false
      },
    ],     
  });
  return tamer;
}

exports.bkgs_load = async (tamer_id) => {
  let bkgs = await Tamer_Background.findAll({
    raw:true,
    where: {fk_tamer_background_tamer: tamer_id},
    attributes: [],
    include: [
      {
        model:Background,
        attributes: ['short_name'],
        include: 'Field',
        required: false
      },
    ],     
  });
  let backgrounds = [];
  bkgs.forEach(bkg => {
    backgrounds.push({
      short_name: bkg['Background.short_name'],
      field: bkg['Background.Field.name'],
    })
  });
  return backgrounds;
}
//Updates

exports.full_save = (tamer) => { 
  tamer.party = JSON.stringify(tamer.party);
  Tamer.update(tamer,{where:[{login:tamer.login}]});
}

exports.tamer_increment_battles = (tamer_id) => {
  Tamer.increment({'battles': 1},{ where: { login: tamer_id}});
}

exports.tamer_increment_victories = (tamer_id) => {
  Tamer.increment({'victories': 1},{ where: { login: tamer_id}});
}