const digimon_repo = require('../repository/digimon');
const digimon_factory = require('../src/Classes/Digimon');

async function _digimons_info_load(digimons){
  if(digimons){
    for (let index = 0; index < digimons.length; index++) {
      let skills = await digimon_repo.digimon_load_skills(digimons[index].id);
      digimons[index].skills = [];
      for(const indexs in skills){
        digimons[index].skills.push(skills[indexs]['Skill.name']);
      }
    }
  }
  return digimons;
}

async function digimons_factory(digimons_list){
  let loading = await _digimons_info_load(digimons_list);
  let digimons = {};
  for (let index = 0; index < loading.length; index++) {
    digimons[loading[index].id]=(digimon_factory(loading[index]));
  }
  return digimons;
}

//Insert

//Select

exports.get_digimon = async (digimon_id) => {
  let digimons_list =  await digimon_repo.get_digimon(digimon_id);
  return await digimons_factory(digimons_list);  
}

exports.get_digimons = async (filter) => {
  let digimons_list =  await digimon_repo.get_digimons(filter);
  return await digimons_factory(digimons_list);  
}

exports.get_all_digimons = async (tamer_id) => {
  let digimons_list =  await digimon_repo.get_all_digimons(tamer_id);
  return await digimons_factory(digimons_list);  
}

exports.get_party_digimons = async (tamer_id) => {
  let digimons_list =  await digimon_repo.get_party_digimons(tamer_id);
  return await digimons_factory(digimons_list);  
}

//Update

exports.digimon_save = (digimon) => {
  digimon_repo.digimon_save(digimon);
}

exports.increment_battles = (digimon_id) => {
  digimon_repo.digimon_increment_battles(digimon_id);
}

exports.increment_victories = (digimon_id) => {
  digimon_repo.digimon_increment_victories(digimon_id);
}