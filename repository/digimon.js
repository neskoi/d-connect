const database = require('../src/database/index');
const {Attribute, Element, Evostage, Field, Mon, Skill, Personality, Place, Tamer, Tamer_Monskin, Tamermon, Tamermon_Skill} = database.models;
const {Op} = require('sequelize');
const {ATTRIBUTE, ELEMENT, PERSONALITY} = require('../src/Classes/constants');
const {ramdom} = require('../util/util');


//========================================================
// Digimon Insert Operations
//========================================================

exports.digimon_born = async function(tamer_id, specie_id, place_id){
  let digimon;
    try {
      digimon = await Tamermon.create({
        fk_tamermon_tamer: tamer_id,
        fk_tamermon_mon: specie_id,
        fk_tamermon_personality: ramdom(1, Object.keys(PERSONALITY).length),
        fk_tamermon_place: place_id,
        natural_atk: ramdom(1, 10),
        natural_def: ramdom(1, 10),
        natural_con: ramdom(1, 10),
        natural_int: ramdom(1, 10),
        natural_tec: ramdom(1, 10),
        natural_spd: ramdom(1, 10),
      })
    } catch (error) {
      console.log(error);
    }
  await digimon.reload();
  return digimon;
}

//========================================================
// Digimon Select Operations
//========================================================

//Get One Digimon
exports.get_digimon = async (digimon_id) => {
  let digimon = await Tamermon.findOne({
  order:[['id', 'ASC']],
  where:{id: digimon_id},
  include:[{model: Tamer, attributes: ['login']},
           {model: Personality, attributes: ['name']}, 
           {model: Place, attributes: ['name']}],
  raw:true});
  return digimon;
}

exports.get_digimons = async (tamer_id, place) => {
  let digimons = await Tamermon.findAll({
    order:[['id', 'ASC']],
    where:{[Op.and]:{fk_tamermon_tamer: tamer_id, fk_tamermon_place: 1}},
      include:[
        {model: Tamer, attributes: ['login']},
        {model: Personality, attributes: ['name']},
        {model: Tamer_Monskin, 
          attributes: [], 
          where:{fk_tamer_monskin_tamer: tamer_id},
          include: 'Monskin',
          required: false
        }, 
        {model: Place, attributes: ['name']},
        {model: Mon, include:[
            {model: Attribute, attributes: ['name']}, 
            {model: Element, attributes: ['name']}, 
            {model: Evostage, attributes: ['name']},
            {model: Field, attributes: ['name']}
        ]}
      ],
      raw:true,
    });
  return digimons;
}

//Get All Digimons from a tamer
exports.get_all_digimons = async (tamer_id) => {
  let digimons = await Tamermon.findAll({
    order:[['id', 'ASC']],
    where:{[Op.and]:{fk_tamermon_tamer: tamer_id, fk_tamermon_place: 1}},
      include:[
        {model: Tamer, attributes: ['login']},
        {model: Personality, attributes: ['name']},
        {model: Tamer_Monskin, 
          attributes: [], 
          where:{fk_tamer_monskin_tamer: tamer_id},
          include: 'Monskin',
          required: false
        }, 
        {model: Place, attributes: ['name']},
        {model: Mon, include:[
            {model: Attribute, attributes: ['name']}, 
            {model: Element, attributes: ['name']}, 
            {model: Evostage, attributes: ['name']},
            {model: Field, attributes: ['name']}
        ]}
      ],
      raw:true,
    });
  return digimons;
}

//========================================================
// Digimon Related Select Operations
//========================================================

exports.digimon_learn_skill = async (digimon_id, skill_name, active = 0) => {
  let skill_id = await Skill.findOne({where: [{name: skill_name}]});
  Tamermon_Skill.create({fk_tamermon_skill_tamermon: digimon_id, fk_tamermon_skill_skill: skill_id.id, active: active});
}

exports.digimon_load_skills = async (tamermon_id) => {
  skills = await Tamermon_Skill.findAll({
    raw: true,
    attributes: ['fk_tamermon_skill_skill'], 
    where:{fk_tamermon_skill_tamermon: tamermon_id},
    include:[{model: Skill, attributes:['name']}],
  });
  return skills;
}

//========================================================
// Digimon Update Operations
//========================================================

exports.digimon_save = (digimon) => {
  Tamermon.update({
    exp: digimon.exp,
    weight: digimon.weight,
    poops: digimon.poops,
    battles: digimon.battles,
    victories: digimon.victories,
    hunger: digimon.status.hunger,
    health: digimon.status.health,
    energy: digimon.status.energy,
    joy: digimon.status.joy,
    bond: digimon.status.bond,
    trait: digimon.status.trait,
    is_sick: digimon.is_sick,
  },{where:{id:digimons[index].id}});
}

exports.update_digimon = (digimon_id, values) => {
  return Tamermon.update(values,{where:{id:digimon_id}})
}

exports.digimon_increment_battles = (digimon_id) => {
  Tamermon.increment({battles: 1, where:{id: digimon_id}});
}

exports.digimon_increment_victories = (digimon_id) => {
  Tamermon.increment({victories: 1, where:{id: digimon_id}});
}