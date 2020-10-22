const database = require('../src/database/index');
const db = database.models;
const {Op} = require('sequelize');
//const {ATTRIBUTE, background, PERSONALITY} = require('../src/Classes/constants');


exports.load_personality = async () => {
  let personality = await db.Personality.findAll({
    raw: true,
  });
  return personality
}

exports.load_attribute = async () => {
  let attribute = await db.Attribute.findAll({
    raw: true,
  });
  return attribute
}

exports.load_element = async () => {
  let element = await db.Element.findAll({
    raw: true,
  });
  return element
}

exports.load_field = async () => {
  let field = await db.Field.findAll({
    raw: true,
  });
  return field
}

exports.load_background = async () => {
  let background = await db.Background.findAll({
    raw: true,
  });
  return background
}

exports.load_mon = async () => {
  let mon = await db.Mon.findAll({
    raw: true,
  });
  return mon
}

exports.load_evostage = async () => {
  let evostage = await db.Evostage.findAll({
    raw: true,
  });
  return evostage
}

exports.load_evochart = async () => {
  let evochart  = await db.Evochart .findAll({
    raw: true,
  });
  return evochart
}

exports.load_skill = async () => {
  let skill = await db.Skill.findAll({
    raw: true,
  });
  return skill
}

exports.load_mon_skill = async () => {
  let mon_skill = await db.Mon_Skill.findAll({
    raw: true,
  });
  return mon_skill
}

exports.load_monskin = async () => {
  let monskin = await db.Monskin.findAll({
    raw: true,
  });
  return monskin
}

exports.load_drop = async () => {
  let drop = await db.Drop.findAll({
    raw: true,
  });
  return drop
}

exports.load_item = async () => {
  let item = await db.Item.findAll({
    raw: true,
  });
  return item
}

exports.load_place = async () => {
  let place = await db.Place.findAll({
    raw: true,
  });
  return place
}

exports.load_skin = async () => {
  let skin = await db.Skin.findAll({
    raw: true,
  });
  return skin
}

exports.load_language = async () => {
  let language = await db.Language.findAll({
    raw: true,
  });
  return language
}