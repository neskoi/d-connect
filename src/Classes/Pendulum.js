const {SKILL} = require('./skill');
const {FIELD, PERSONALITY} = require('./constants');
const io = require('../io/io').io();


const BASE_MULTIPLIER = 3; //multiplicador base
const LOOP_TIME = 1;

class Pendulum{
  constructor(party){
    this.digimons = party.digimons;
    this.active_digimon = party.configuration[0].id;
    this.configuration = party.configuration;
    this.connection;
    this.elapsed = 0;
    this.last_poop = 0;
    this.party__update(party);
    this.loop;
    this._start_pendulum();
  }
//todo organizar o background advindo do pendulum com o de party
//========================================================
// Status Manipulation
//========================================================

// todo a cada ciclo manipular o valor e personalidade

//todo configurar a subida e decida de cada status, coco, sick, adicionar  classe
//configurar os debuffs, buffs e agilizar o sistema de ailments

//todo tirar bloqueio de cagada no login, digimon precisa poder cagar assim q logar caso a criteria permita.

party__update(party){
  this.digimons = party.digimons;
  for(const index in party.configuration){
    this.digimons[party.configuration[index].id].start_time = this.elapsed;
    this.digimons[party.configuration[index].id].background = party.configuration[index].bkg;
    this.digimons[party.configuration[index].id].bond_count = 0;
    this.digimons[party.configuration[index].id].light = party.configuration[index].light;
  }
  /* recebe digimons e adiciona o basico necessario relativo a pendulum, bkg, light, time, etc */
}

//========================================================
// LOOP
//========================================================
  _loop(){
    let sweet_spot = FIELD[this.digimons[this.active_digimon].field].sweet_spot(this.digimons[this.active_digimon]);
    let debuff_multiplier = 0;

    this.digimons[this.active_digimon].status.hunger -= Math.floor((BASE_MULTIPLIER * PERSONALITY[this.digimons[this.active_digimon].personality].hungry_rate) * sweet_spot);
      //atk con   
    if(this.digimons[this.active_digimon].light){ //spd def
      this.digimons[this.active_digimon].status.energy -= Math.floor((BASE_MULTIPLIER * PERSONALITY[this.digimons[this.active_digimon].personality].energy_rate) * sweet_spot);
    }else{
      this.digimons[this.active_digimon].status.energy += (BASE_MULTIPLIER * 4) * PERSONALITY[this.digimons[this.active_digimon].personality].energy_rate;
    }

    if(this._good_place()){
      this.digimons[this.active_digimon].status.joy -= Math.floor(((BASE_MULTIPLIER * PERSONALITY[this.digimons[this.active_digimon].personality].joy_rate)/2) * sweet_spot);
    }else{
      this.digimons[this.active_digimon].status.joy -= Math.floor((BASE_MULTIPLIER * PERSONALITY[this.digimons[this.active_digimon].personality].joy_rate) * sweet_spot);
    }
      //int tec

    if(this.digimons[this.active_digimon].status.hunger < 100){
      debuff_multiplier++;
    };
    if(this.digimons[this.active_digimon].status.energy < 100){
      debuff_multiplier++;
    };
    if(this.digimons[this.active_digimon].status.joy < 100){
      debuff_multiplier++;
    };

    if(debuff_multiplier > 0){
      this.digimons[this.active_digimon].status_decrease('health',BASE_MULTIPLIER * debuff_multiplier);
    }
    
    this.digimons[this.active_digimon].is_sick = this._is_sick();

    if(this.digimons[this.active_digimon].status.health < 200 || this.digimons[this.active_digimon].is_sick || this.digimons[this.active_digimon].poops == 5){  
      this.digimons[this.active_digimon].status_decrease('trait', BASE_MULTIPLIER * (Math.round(this.digimons[this.active_digimon].poops / 2) + 1));
      this.digimons[this.active_digimon].status_decrease('bond',BASE_MULTIPLIER * (Math.round(this.digimons[this.active_digimon].poops / 4) + 1));
    }
    if(sweet_spot != 1){
      this.digimons[this.active_digimon].status_increase('trait', 2);
    }else{
      this.digimons[this.active_digimon].status_increase('trait', 1);
    }

    if(this.digimons[this.active_digimon].bond_count > 5 && this.digimons[this.active_digimon].health > 800){
      this.digimons[this.active_digimon].status_increase('bond', 1);
      this.bond_count = 0;
    }else{
      this.bond_count++;
    }

    this._poop();
  }

  _start_pendulum(){
    new Promise((resolve, reject)=>{
      console.log(this.connection);
      if(this.connection){
        resolve();
      }
    }).then(res=>{
      this._start_loop(LOOP_TIME);
    })
  }

  _start_loop(interval){
    this.loop = setInterval(()=>{
      this._loop();
      this.__update();
      this.elapsed++;
      console.log('looping');
    }, 1000 * interval);
  }

  _stop_loop(){
    clearInterval(this.loop);
  }

  _is_sick(){
    if(this.digimons[this.active_digimon].status.health < 600 ){
      let probability = 0;
      let health = this.digimons[this.active_digimon].status.health;
      let sickness = Math.floor(Math.random()*100);
      if(health == 0){
        probability = 100;
      }else if(health < 200){
        probability = 20;
      }else if(health < 400){
        probability = 3;
      }else{
        probability = 2;
      }

      if(sickness < probability || this.digimons[this.active_digimon].status.health <= 0){
        return true;
      }
    }
  }

  _good_place(){
    let actual_bkg = this.digimons[this.active_digimon].background;
    let best_bkg = this.digimons[this.active_digimon].field;
    if(actual_bkg.includes(best_bkg)){
      return true;
    }
    return false;
  }

  _poop(){
    let probability = 1;
    if(this.digimons[this.active_digimon].status.hunger > 300 && this.digimons[this.active_digimon].poops < 5 && this.elapsed - this.last_poop > 10){
      let ramdom = Math.random()*100;
      if(ramdom < probability){
        this.digimons[this.active_digimon].poops++;
        this.digimons[this.active_digimon].status.hunger -= 10;
        this.digimons[this.active_digimon].status.energy -= 10;
        this.last_poop = this.elapsed
      }
    }
  }

  _emotion(){
    let probability = PERSONALITY[this.digimons[this.active_digimon].personality].phrases.probability;
    let rand = Math.round(Math.random() * 100);
    let phrase = '';
    
    if(probability > rand){
      rand = Math.round((Math.random() * 4) + 1);
      let status = Object.keys(this.digimons[this.active_digimon].status)[rand];
      if(this.digimons[this.active_digimon].status[status] < 200){
        phrase = PERSONALITY[this.digimons[this.active_digimon].personality].phrases[status][0];
      }else if(this.digimons[this.active_digimon].status[status] < 400){
        phrase = PERSONALITY[this.digimons[this.active_digimon].personality].phrases[status][1];
      }else if(this.digimons[this.active_digimon].status[status] < 600){
        phrase = PERSONALITY[this.digimons[this.active_digimon].personality].phrases[status][2];
      }else if(this.digimons[this.active_digimon].status[status] < 800){
        phrase = PERSONALITY[this.digimons[this.active_digimon].personality].phrases[status][3];
      }else{
        phrase = PERSONALITY[this.digimons[this.active_digimon].personality].phrases[status][4];
      }
      return phrase;
    }
  }

  __update(){
    io.to(this.connection).emit('pendulum_loop',{
      emotion: this._emotion(),
      hunger: Math.floor(this.digimons[this.active_digimon].status.hunger/10),
      energy: Math.floor(this.digimons[this.active_digimon].status.energy/10),
      joy: Math.floor(this.digimons[this.active_digimon].status.joy/10),
      health: Math.floor(this.digimons[this.active_digimon].status.health/10),
      friendship: Math.floor(this.digimons[this.active_digimon].status.bond/10),
      light: this.digimons[this.active_digimon].light,
      poops: this.digimons[this.active_digimon].poops,
      active_digimon: this.active_digimon,
    });
  }

  _sync(){
    let elapsed_time = this.elapsed - this.digimons[this.active_digimon].start_time;
    for(let i = 0; i < elapsed_time; i++){
      this._loop();
    }
  }

//========================================================
// public
//========================================================

  swap(digimon_id){
    if(typeof this.digimons[digimon_id] !== 'undefined'){
      this.digimons[this.active_digimon].start_time = this.elapsed;
      this.active_digimon = digimon_id;
      this._stop_loop();
      this._sync();
      this.__update();
      this._start_loop(LOOP_TIME);
    }
  }

  end_pendulum(digimons){
    this._stop_loop();
    for(const index in digimons){
      console.log(index);
      this.active_digimon = digimons[index].id;
      this._sync();
    }
  }

  set_connection(connection){
    this.connection = connection;
    //this._start_loop(LOOP_TIME);
    //todo rever inicio do pendulum
    this.__update();
  }

  poop_clean(){
    if(this.digimons[this.active_digimon].poops > 0){
      this.digimons[this.active_digimon].poops--;
      this.digimons[this.active_digimon].status.joy += 50;
      this.__update();
    }
  }

}


function pendulum_factory(party){
  return new Pendulum(party);
}

module.exports = (party) => {
  return pendulum_factory(party);
}