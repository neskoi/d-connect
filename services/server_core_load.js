const core_repo = require('../repository/core');

function array_to_obj(list){
  let new_obj = {};
  list.forEach(element => {
    new_obj[element.id] = element;
    delete new_obj[element.id].id;
  });
  return new_obj;
}

exports.test = async () => {
  module.exports.background();
}

exports.personality = async () => {
  let load = await core_repo.load_personality();
  let personality = array_to_obj(load);
  console.log('Personality global has been loaded.');
  return personality;
}

exports.attribute = async () => {
  let load = await core_repo.load_attribute();
  let attribute = array_to_obj(load);
  console.log('Attribute global has been loaded.');
  return attribute;
}

exports.element = async () => {
  let load = await core_repo.load_element();
  let element =  array_to_obj(load);
  console.log('Element global has been loaded.');
  return element;
}

exports.field = async () => {
  let load = await core_repo.load_field();
  let field = array_to_obj(load);
  console.log('Field global has been loaded.');
  return field;
}

exports.background = async () => {
  let load = await core_repo.load_background();
  let background = array_to_obj(load);
  console.log('Background global has been loaded.');
  return background;
}

exports.mon = async () => {
  let load = await core_repo.load_mon();
  let mon = array_to_obj(load);
  console.log('Mon global has been loaded.');
  return mon;
}

exports.evostage = async () => {
  let load =  await core_repo.load_evostage();
  let evostage = array_to_obj(load);
  console.log('Evostage global has been loaded.');
  return evostage;
}

exports.evochart = async () => {
  let load = await core_repo.load_evochart();
  let evochart =  array_to_obj(load);
  console.log('Evochart global has been loaded.');
  return evochart;
}

exports.skill = async () => {
  let load = await core_repo.load_skill();
  let skill = array_to_obj(load);
  console.log('Skill global has been loaded.');
  return skill;
}

//possivelmente va ficar como array pra facilitar a busca
exports.mon_skill = async () => {
  let load = await core_repo.load_mon_skill();
  let mon_skill = array_to_obj(load);
  console.log('Mon_Skill global has been loaded.');
  return mon_skill;
}

exports.monskin = async () => {
  let load =  await core_repo.load_monskin();
  let monskin = array_to_obj(load);
  console.log('Monskin global has been loaded.');
  return monskin;
}

exports.drop = async () => {
  let load =  await core_repo.load_drop();
  let drop = array_to_obj(load);
  console.log('Drop global has been loaded.');
  return drop;
}

exports.item = async () => {
  let load =  await core_repo.load_item();
  let item = array_to_obj(load);
  console.log('Item global has been loaded.');
  return item;
}

exports.place = async () => {
  let load =  await core_repo.load_place();
  let place = array_to_obj(load);
  console.log('Place global has been loaded.');
  return place;
}

exports.skin = async () => {
  let load =  await core_repo.load_skin();
  let skin = array_to_obj(load);
  console.log('Skin global has been loaded.');
  return skin;
}

exports.language = async () => {
  let load =  await core_repo.load_language();
  let language = load;
  console.log('Language global has been loaded.');
  return language;
}