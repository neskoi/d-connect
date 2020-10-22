const io = require('../io/io').io();

const {SKILL} = require('./skill');
const {ATTRIBUTE, ELEMENT, PERSONALITY} = require('./constants');

class Battle{
  constructor(match_info, battlers){
		this.battle_id;
		this.battle_log = [];
		this.battlers = battlers;
		this.cooldown;
		this.happened = [];
		this.first = Object.keys(match_info)[0];
		this.second = Object.keys(match_info)[1];
		
		this.tamer = match_info;

		this.digimons_in_battle = {
			[this.first]: match_info[this.first].party.length,
			[this.second]: match_info[this.second].party.length,
		};
		
		this.failure = {
			[this.first]: 0,
			[this.second]: 0,
		};

		this.turn_pointer = 0;
		this.turn_order = [];
		this.__turn_order_generator(this.battlers);
		this.elapsed_turns = 1;
		this.battle_clock; 
	}

//========================================================
// Private functions
//========================================================

//todo adicionar um controlador para buffs e debuffs

	//melhorar turn, inibir que so um jogador fique com todas as rodadas todo
  __turn_order_generator(battlers){
		let match_speed = 0;
		let atk_readiness = {};
		let atk_load = {};

		for (const index in battlers) {
			if(battlers[index].is_alive()){
				match_speed += battlers[index].stats.spd;
			}
		}

		for (const index in battlers) {
			if(battlers[index].is_alive()){
				atk_load[index] = battlers[index].stats.spd/match_speed;
				atk_readiness[index] = atk_load[index];
			}
		}
		let max = 0;
		let digimon_id = 0;
		
		while(this.turn_order.length < 20){
			for (let index in atk_load) {
				atk_readiness[index] += atk_load[index];				
				if(atk_readiness[index] > max){					
					max = atk_readiness[index];
					digimon_id = index;		
				}
			}
			if(max >= 1){
				atk_readiness[digimon_id] -= 1;
				max = atk_readiness[digimon_id];
				this.turn_order.push(battlers[digimon_id].id);
			}		
		}
	}

	__happened(event, starter, defender = 0, context = 0){
		this.happened.push({event, starter, defender, context});
	}

	__happened_flush(){
		this.happened.length = 0;
	}

	//what happen, who did, the target, the effects, what is used to
	__verbose(event, starter, target = 0, value = 0, with_what = 0){
		this.battle_log.push({event, starter, target, value, with_what});
	}

	//clean the texts
	__verbose_flush(){
		this.battle_log.length = 0;
	}

	// achar uma resposta melhor todo
	__other_tamer(tamer){
		if(tamer == this.first ){
			tamer = this.second;
		}else{
			tamer = this. first;
		}
		return tamer;
	}

	__actual_digimon(){
		return this.turn_order[this.turn_pointer];
	}

	digimon_is_in_battle(digimon_id){
		return typeof this.battlers[digimon_id] !== 'undefined';
	}

//========================================================
// Clock functions
//========================================================

__start_timer(){
	this.battle_clock = setTimeout(()=>{			
		let digimon = this.turn_order[this.turn_pointer];
		let tamer = this.battlers[digimon].tamer;
		
		this.failure[tamer]++;
		if(this.failure[tamer] > 2){
			 this.left(tamer);
			 return;
		}
		this.__verbose('did_nothing', tamer);

		this.battle_action();
	},30500);
}

__stop_timer(){
	clearTimeout(this.battle_clock);
}

//========================================================
// Action functions
//========================================================

	attack(target_id){
		let digimon_id = this.__actual_digimon();
		let damage = this.battlers[digimon_id].attack(this.battlers[target_id]);
		this.battlers[target_id].hp_decrease(damage);
		this.__happened('attack', digimon_id, target_id);
		this.__verbose('attack', this.battlers[digimon_id].name, this.battlers[target_id].name, damage);
	}

	use_skill(skill, target){
		let digimon = this.__actual_digimon();
		let skill_val = this.battlers[digimon].use_skill(skill,this.battlers[digimon],this.battlers[target]);
		this.__happened('skill', digimon, target, skill);
		this.__verbose('skill', this.battlers[digimon].name, this.battlers[target].name, skill_val.damage, skill);
		
		skill_val.inflict.forEach(anomaly => {
			this.__happened(anomaly, digimon, target, skill);
			this.__verbose(anomaly, this.battlers[digimon].name, this.battlers[target].name, skill_val.damage, skill);
		})
	}
//todo terminar o log de item, desmembrar item comum e de batalha, melhorar logica das escolhas de combate
	use_item(item, item_effect){
		let digimon = this.__actual_digimon();
		this.__happened('item', digimon, 0, item);
		this.__verbose('item', this.battlers[digimon].name, item);
		console.log(item_effect);
		if(item_effect){
			item_effect.inflict.forEach(anomaly => {
				this.__happened(anomaly, digimon, item, item);
				this.__verbose(anomaly, this.battlers[digimon].name, item, item_effect.value, item);
			})
		}
	}

	battle_action(){
		this.__buff_debuff_duration_evaluater();
		this.__next_turn();
		this.update_battle();
		this.__stop_timer();
		clearTimeout(this.cooldown);
		this.cooldown = setTimeout(() => {
			this.__start_timer();
		}, 2000 * this.battle_log.length);

		this.__happened_flush();
		this.__verbose_flush();
	}

//========================================================
// Life check
//========================================================

	is_alive(digimon){
		return this.battlers[digimon].is_alive();
	}

	team_can_battle(tamer){
		for(let i = 0; i < this.tamer[tamer].party.length; i++){
			if(this.battlers[this.tamer[tamer].party[i].id].is_alive()){
				return true;
			}
		}
		return false;
	}

	can_battle(tamer, digimon){
		tamer = this.__other_tamer(tamer);
		if(!this.is_alive(digimon)){
			this.__recalculate_turn_order();
			this.__happened('faint', this.battlers[digimon].id);
			this.__verbose('faint', this.battlers[digimon].name);
			if(!this.team_can_battle(tamer)){
				this.__happened('end', this.__other_tamer(tamer));
				this.update_battle();
				this.__end_battle();
				return false;
			}
			this.update_battle();
		}
		return true;
	}

	__buff_debuff_duration_evaluater(){
		let digimon = this.__actual_digimon();
		let status = ['abnormal_status', 'buff','debuff'];
		status.forEach(anomaly => {
			for(const type in this.battlers[digimon][anomaly]){
				this.battlers[digimon][anomaly][type].elapsed++;

				//this.battlers[digimon][anomaly][type].effect();
				//todo terminando menssagens de acontecimentos da batalha
				if(this.battlers[digimon][anomaly][type].duration <= this.battlers[digimon][anomaly][type].elapsed){
					this.battlers[digimon][anomaly][type].stacks--;
					this.battlers[digimon][anomaly][type].elapsed -= 	this.battlers[digimon][anomaly][type].duration;
				}
				
				if(this.battlers[digimon][anomaly][type].stacks <= 0){
					this.battlers[digimon].remove_anomaly(anomaly, type);
					this.__happened(`${anomaly}_${type}_end`, this.battlers[digimon].name);
					this.__verbose(`${anomaly}_${type}_end`, this.battlers[digimon].name);
				}
			}
		})
	}

//========================================================
// To trust functions
//========================================================

	has_this_skill(skill){
		return this.battlers[this.__actual_digimon()].has_skill(skill);
	}

	has_hpsp(skill){
		return this.battlers[this.__actual_digimon()].has_hpsp(skill);
	}

	is_tamer_turn(tamer){
		let actual_digimon = this.__actual_digimon();
		return this.tamer[tamer].party.some(digimon => digimon.id == this.battlers[actual_digimon].id);
	}

//========================================================
// Battle flux functions
//========================================================

	start_battle(){
		TAMER_LIST[this.first].in_battle = this.battle_id;
		TAMER_LIST[this.second].in_battle = this.battle_id;

		this.__start_timer();
		io.to('battle_' + this.battle_id).emit('pvp_battle_start', {
			battle_id: this.battle_id,
			battlers: this.__battlers_to_client(), 
			digimons_in_battle: this.digimons_in_battle,
			turn_order: this.turn_order, 
			turn_pointer: this.turn_pointer
		});
	}

	__end_battle(){
		this.__stop_timer();
		if(TAMER_LIST[this.first] && TAMER_LIST[this.first].in_battle !== false){
			TAMER_LIST[this.first].in_battle = false;
		}
		if(TAMER_LIST[this.second] && TAMER_LIST[this.second].in_battle !== false){
			TAMER_LIST[this.second].in_battle = false;
		}

		BATTLES.splice(this.battle_id, 1);
	}

	update_battle(){
		let battle_update = {
			battle_id: this.battle_id,
			battle_log: this.battle_log,
			battlers: this.__battlers_to_client(), 
			happened: this.happened,
			turn_order: this.turn_order, 
			turn_pointer: this.turn_pointer,
			failure: this.failure,
			digimons_in_battle: this.digimons_in_battle
		};
		io.to('battle_' + this.battle_id).emit('update_battle', battle_update);
	}

	__recalculate_turn_order(){
		this.turn_order.splice(0, this.turn_order.length);
		this.__turn_order_generator(this.battlers);
	}

	__next_turn(){
		this.turn_pointer < this.turn_order.length - 1 ? this.turn_pointer++ : this.turn_pointer = 0;
		this.elapsed_turns++;
	}

	__battlers_to_client(){
		let battlers_info = {};
		for(const index in this.battlers){
			battlers_info[index]={
				digimon_id: this.battlers[index].id,
				digimon_name: this.battlers[index].name,
				specie: this.battlers[index].specie,
				stage: this.battlers[index].stage,
				hp: this.battlers[index].stats.hp,
				max_hp: this.battlers[index].stats.max_hp,
				sp: this.battlers[index].stats.sp,
				max_sp: this.battlers[index].stats.max_sp,
				abnormal_status: this.battlers[index].abnormal_status,
				buff: this.battlers[index].buff,
				debuff: this.battlers[index].debuff,
				tamer: this.battlers[index].tamer,
			};
		}
		return battlers_info;
	}


//========================================================
// Abnormal handles 
//========================================================

	left(tamer){
		this.__happened('left', tamer);
		this.__verbose('left', tamer);
		tamer = this.__other_tamer(tamer);
		this.__happened('end', tamer);
		this.update_battle();
		this.__end_battle(tamer);
	}
}

module.exports = (match_info, battlers) => {
		let battle = new Battle (match_info, battlers);
		return battle;
}