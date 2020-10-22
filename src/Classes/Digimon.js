const SKILL = require('./skill');
const {ATTRIBUTE, ELEMENT, PERSONALITY} = require('./constants');

class Digimon{
  constructor(digimon){
    this.id = digimon.id;
    this.name = digimon.nickname;
    this.tamer = digimon['Tamer.login'];
    this.specie = digimon['Mon.specie'];
    this.skin = digimon['Tamer_Monskin.Monskin.short_name'];
    this.stage = digimon['Mon.Evostage.name'];
    this.attribute = digimon['Mon.Attribute.name'],
    this.element = digimon['Mon.Element.name'],
    this.field = digimon['Mon.Field.name'],

    this.age = this.__age_calculator(digimon.createdAt);
    this.personality = digimon['Personality.name'];
    this.exp = digimon.experience;
    this.lvl = this.__level_formula(this.exp);
    this.weight = digimon.weight;
    this.poops = digimon.poops;
    this.battles = digimon.battles;
    this.victories = digimon.victories;
    this.place = digimon['Place.name'];  

    this.status = {
      hunger: digimon.hunger,
      health: digimon.health,
      energy: digimon.energy,
      joy: digimon.joy,
      bond: digimon.bond,
      trait: digimon.trait
    }

    this.is_sick = digimon.is_sick;

    this.stats = {
      hp:  this.__hpsp_formula(digimon['Mon.base_con'], digimon.natural_con, digimon.train_con, PERSONALITY[this.personality].con, this.lvl),
      sp:  this.__hpsp_formula(digimon['Mon.base_int'], digimon.natural_int, digimon.train_int, PERSONALITY[this.personality].int, this.lvl),
      atk: this.__stats_formula(digimon['Mon.base_atk'], digimon.natural_atk, digimon.train_atk, PERSONALITY[this.personality].atk, this.lvl),
      def: this.__stats_formula(digimon['Mon.base_def'], digimon.natural_def, digimon.train_def, PERSONALITY[this.personality].def, this.lvl),
      con: this.__stats_formula(digimon['Mon.base_con'], digimon.natural_con, digimon.train_con, PERSONALITY[this.personality].con, this.lvl),
      int: this.__stats_formula(digimon['Mon.base_int'], digimon.natural_int, digimon.train_int, PERSONALITY[this.personality].int, this.lvl),
      tec: this.__stats_formula(digimon['Mon.base_tec'], digimon.natural_tec, digimon.train_tec, PERSONALITY[this.personality].tec, this.lvl),
      spd: this.__stats_formula(digimon['Mon.base_spd'], digimon.natural_spd, digimon.train_spd, PERSONALITY[this.personality].spd, this.lvl), 
    }
    

    //todo terminar o sistema de buff debuff e mudar a exibicao do cliente de scale pra resize
    this.stats.max_hp = this.stats.hp;
    this.stats.max_sp = this.stats.sp;
    this.abnormal_status = {/* 
                            infection:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0, 
                            effect(){
                              console.log('this is the status callback');
                            }} ,
                            stun:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0}, 
                            silence:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0}, 
                            sleep:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0} */}
    this.buff = {
      /* def:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0},
                  con:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0},
                  int:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0},
                  atk:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0},
                  tec:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0},
                  spd:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0} */};

    this.debuff = {
                  /* con:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0},
                  int:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0},
                  atk:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0},
                  def:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0},
                  tec:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0},
                  spd:{origin:'skillX', value:2, stacks: 2, max_stacks:20, duration:1, elapsed: 0} */}; 

    this.rank = this._rank_calculator(this.stats);
    this.skills = digimon.skills;  
    this.color = digimon.alter_color;     
  }
  
//========================================================
// Private functions
//========================================================

  __age_calculator(born){
    let age, day, today;
    day = 1000*60*60*24;
    today =  new Date();
    today = today.getTime();
    born = born.getTime();
    age = ((today-born))/day;
    return Math.round(age);
  }

  __hpsp_formula(base, natural, train, personality, lvl){
    let hpsp = ((((((base + natural) * 10) * personality) *lvl)) / 10) + lvl + 100 + train;
    return Math.round(hpsp);
  }

  __level_formula(digimon_exp){
    for (let lvl = 0; lvl <= 999; lvl++) {
      let lvl_exp = (4*(lvl*lvl*lvl))/5;
      if(lvl_exp >= digimon_exp){
        return lvl;
      }
    }
  }

  __stats_formula(base, natural, train, personality, lvl){
    let stats = ((((((base+natural) * 10) * personality) * lvl)) / 100) + 1 + train;
    return Math.round(stats);
  }

  __atk_damage_formula(target){
    let ramdom = Math.random();
    let damage = 0;
    damage = (((((((((2 * this.lvl) / 5) + 10) * 10) * (this.stats.atk / target.stats.def)) / 25) + 10) * ramdom) * (ATTRIBUTE[this.attribute][target.attribute] * ELEMENT[this.element][target.element])) + (this.stats.atk * 0.1) ;
    damage = Math.round(damage);
    return damage;
  }

  _rank_calculator(stats){
    let total_stats = 0;
    for (let index = 4; index < Object.keys(stats).length; index++) {
      total_stats += stats[Object.keys(stats)[index]];
    }
    let rank =  total_stats/100;
    return Math.round(rank);
  }
  
//========================================================
// Public functions
//========================================================

  has_hp(value){
    if(this.stats.hp > value + 1){
      return true;
    }
    return false;
  }

  has_sp(value){
    if(this.stats.sp >= value){
      return true;
    }
    return false;
  }

  has_hpsp(skill){
    let cost = SKILL[skill].cost;
    if(SKILL[skill].is_sp){
      return this.has_sp(cost);
    }
    return this.has_hp(cost);
  }

  has_skill(skill){
    for(const index in this.skills){
      if(this.skills[index] == skill){
        return true;
      }
    }
    return false;
  }

  use_skill(skill, caster, target){
    return SKILL[skill].use(caster, target);
  }

  attack(target){
    return this.__atk_damage_formula(target);
  }

  hp_increase(heal){
    if(this.stats.hp + heal >= this.stats.max_hp){
      this.stats.hp = this.stats.max_hp;
    }else{
      this.stats.hp += heal;
    }
  }

  hp_decrease(damage){
    if(this.stats.hp - damage <= 0){
      this.stats.hp = 0;
    }else{
      this.stats.hp -= damage;
    }
  }

  sp_increase(heal){
    if(this.stats.hp + heal >= this.stats.max_hp){
      this.stats.hp = this.stats.max_hp;
    }else{
      this.stats.hp += heal;
    }
  }

  sp_decrease(consumption){
    if(this.stats.sp - consumption <= 0){
      this.stats.sp = 0;
    }else{
      this.stats.sp -= consumption;
    }
  }

  status_increase(wich, value){
    if(this.status[wich] + value >= 1000){
      this.status[wich] = 1000;
    }else{
      this.status[wich] += value;
    }
  }

  status_decrease(wich, value){
    if(this.status[wich] - value <= 0){
      this.status[wich] = 0;
    }else{
      this.status[wich] -= value;
    }
  }

  is_alive(){
    if(this.stats.hp > 0){
      return true;
    }
    return false;
  }

  skill_description_attacher(language){
    let skills = {};
    this.skills.forEach(element => {
      skills[element] = {
        cost: SKILL[element].cost,
        is_mp: SKILL[element].is_mp,
        description: SKILL[element][`description_${language}`],
      };
    });
    return skills;
  }

//========================================================
// Anomaly Status Manipulation
//========================================================

  add_anomaly(anomaly, type, origin, value, max_stacks, duration, effect){
    let anomaly_info = {
      origin,
      value, 
      stacks: 1,
      max_stacks,
      duration,
      elapsed: 0,
      effect,
    };
   
    if(!this[anomaly][type]){
      this[anomaly][type] = anomaly_info;
    }else {
      if(this[anomaly][type].origin != origin){
        this[anomaly][type] = anomaly_info;
      }else if(this[anomaly][type].stacks < this[anomaly][type].max_stacks){
        this[anomaly][type].stacks++;
      }
    }
  }

  remove_anomaly(anomaly, type){
    delete this[anomaly][type];
  };
}

module.exports = (loading_digimon) => {
  return new Digimon(loading_digimon)
}