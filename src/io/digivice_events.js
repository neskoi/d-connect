const Battle = require('../Classes/Battle');
const digimon_repo = require('../../repository/digimon');
const DigimonsList = require('../Classes/DigimonsList');

module.exports = (io, socket, tamer)=>{

  function notify(message, type = ''){
    socket.emit('notify', {message, type});
  }

  function send_self_information(){
    socket.emit('self_information_update', {
      login: tamer.login,
      bit: TAMER_LIST[tamer.login].tamer.bit,
      docoin: TAMER_LIST[tamer.login].tamer.docoin,
      language: TAMER_LIST[tamer.login].tamer.language,
    });
  }

  function send_self_inventory(){
    socket.emit('self_inventory_update', {
      inventory: TAMER_LIST[tamer.login].inventory.description_attacher('en'),
    });
  }

  function send_party_update(){
    socket.emit('party_update',{
      active_digimon: TAMER_LIST[tamer.login].pendulum.active_digimon,
      my_party: TAMER_LIST[tamer.login].party.digimons,
      party_config: TAMER_LIST[tamer.login].party.configuration,
    });
  }

  send_self_information();
  send_self_inventory();
  send_party_update();
  
  TAMER_LIST[tamer.login].party.subscribe(()=>{
    send_party_update();
    TAMER_LIST[tamer.login].pendulum.__update();
  });
//========================================================
// Digivice Events
//========================================================

  socket.on('get_digimon_list', async (data) => {
    if(!TAMER_LIST[tamer.login].digimon_list){
      TAMER_LIST[tamer.login].digimon_list = DigimonsList(tamer.id);
    } 
    await TAMER_LIST[tamer.login].digimon_list.get_page(data.page).then((send_page)=>{
      TAMER_LIST[tamer.login].digimon_list.send_page(TAMER_LIST[tamer.login].socket_id, send_page);
    });
  });

  socket.on('digimon_change_name', async (data) => {
    if(data.new_name.length > 1 && data.new_name.length < 20){
      let digimon = await digimon_repo.get_digimon(data.digimon_id);
      if(digimon.nickname == 'Digimon'){
        let values = {nickname:data.new_name}
        digimon_repo.update_digimon(data.digimon_id, values)
        .then((res) => {
          console.log('name changed');
        });
      }else{
        notify('U cant change name');
      }
    }else{
      notify('Invalid name');
    }
  });

  socket.on('add_digimon_party', (data) => {
    TAMER_LIST[tamer.login].party.add_digimon(TAMER_LIST[tamer.login].digimon_list.data[data.id]); 
  });

  socket.on('remove_digimon_party', (data) => {
    TAMER_LIST[tamer.login].party.remove_digimon(data.id, TAMER_LIST[tamer.login].pendulum.active_digimon);  
  });

  socket.on('swap_digimon', (data) => {
    TAMER_LIST[tamer.login].party.swap_digimon(data.old_id, TAMER_LIST[tamer.login].digimon_list.data[data.new_id]);
  });

  socket.on('swap_digimon_inside_party', (data) => {
    TAMER_LIST[tamer.login].party.swap_digimon_inside_party(data.old_id, data.new_id);  
  });

  socket.on('change_pendulum_bkg', (data) => {
    let digimon = TAMER_LIST[tamer.login].pendulum.active_digimon;
    TAMER_LIST[tamer.login].party.swap_digimon_bkg(digimon, data.bkg);
  });

  socket.on('lights_switch', () => {
    let digimon = TAMER_LIST[tamer.login].pendulum.active_digimon;
    TAMER_LIST[tamer.login].party.lights_switch(digimon);
  });

//========================================================
// Battle
//========================================================

// TODO arrumar rota de logout

  function battle_action(action, data){
    if(!BATTLES[TAMER_LIST[tamer.login].in_battle] || 
       !BATTLES[TAMER_LIST[tamer.login].in_battle].battle.digimon_is_in_battle(data.target_digimon)){
      return;
    }
    if(!BATTLES[TAMER_LIST[tamer.login].in_battle].battle.is_tamer_turn(tamer.login)){ 
      notify('Its not ur turn, wait.');
    }else{
      if(action == 'attack'){
        BATTLES[TAMER_LIST[tamer.login].in_battle].battle.attack(data.target_digimon);
        if(!BATTLES[TAMER_LIST[tamer.login].in_battle].battle.can_battle(tamer.login, data.target_digimon)){return} 
      }else if(action == 'skill'){
        if(!BATTLES[TAMER_LIST[tamer.login].in_battle].battle.has_this_skill(data.skill)){
          notify('U do not have this skill', 'error');
          return;
        }else{
          if(!BATTLES[TAMER_LIST[tamer.login].in_battle].battle.has_hpsp(data.skill)){
            notify('U dont have enough HP/SP to use this skill.', 'error');
            return;
          }else{
            BATTLES[TAMER_LIST[tamer.login].in_battle].battle.use_skill(data.skill, data.target_digimon);
            if(!BATTLES[TAMER_LIST[tamer.login].in_battle].battle.can_battle(tamer.login, data.target_digimon)){return} 
          }
        }
      }else if(action == 'item'){
        if(!use_item_battle(data)){
          notify('Its not the time for this item', 'error');
          return;
        };
      }
      BATTLES[TAMER_LIST[tamer.login].in_battle].battle.battle_action();
    }

  }

  socket.on('attack',(data) => {
    battle_action('attack', data);
  });

  socket.on('skill', (data) => {
    battle_action('skill', data);
  });

  socket.on('use_item_battle', (data) => {
    battle_action('item', data);
  });

 socket.on('use_item',(data)=>{
    if((!TAMER_LIST[tamer.login].inventory.for_battle(data.item) && !TAMER_LIST[tamer.login].in_battle)){
      use_item(data.item, TAMER_LIST[tamer.login].pendulum.active_digimon);
      TAMER_LIST[tamer.login].pendulum._update();
    }else{
      notify('Is not the time for this.');
    } 
  });

  function use_item(item, target){
    if(TAMER_LIST[tamer.login].inventory.has_item(item)){
      let effect =  TAMER_LIST[tamer.login].inventory.use_item(item, TAMER_LIST[tamer.login].party.digimons[target]);
      TAMER_LIST[tamer.login].inventory.remove_item(item, 1);
      send_self_information();
      return effect;
    }
  }

  function use_item_battle(data){
    if(TAMER_LIST[tamer.login].inventory.has_item(data.item)){
      if((TAMER_LIST[tamer.login].inventory.for_battle(data.item) && TAMER_LIST[tamer.login].in_battle !== false)){
        let item_effect = use_item(data.item, data.target_digimon);
        BATTLES[TAMER_LIST[tamer.login].in_battle].battle.use_item(data.item, item_effect);
        return true;
      }
    }
    return false;
  }

  socket.on('give_up', (data) => {
    if (TAMER_LIST[tamer.login]) {
      if(TAMER_LIST[tamer.login].in_battle){
        BATTLES[TAMER_LIST[tamer.login].in_battle].battle.left(tamer.login);
      }
    }
  });
  
  socket.on('disconnect', () => {
    if (TAMER_LIST[tamer.login]) {
      exit_pvp_pool();
      if(TAMER_LIST[tamer.login].in_battle !== false){
        BATTLES[TAMER_LIST[tamer.login].in_battle].battle.left(tamer.login);
      }
    }
  });

//========================================================
// PVP
//========================================================

  function team_size_check(type, team){
    return team.length >= type + 1;
  }

  function team_rank_calculator(type, party){
    let total_rank = 0;
    for(let i = 0; i <= type; i++){
      total_rank += party.digimons[party.configuration[i].id].rank;
    }
    return total_rank;
  }

  //todo bloquear mudança de party enquanto estiver em pool de pvp

  //PVP solicitation events
  socket.on('pvp_enter_pool', (data) => {   
    let right_team_size = team_size_check(data.type, TAMER_LIST[tamer.login].party.configuration);
    if(!right_team_size){return;}
    if(data.type < 0 || data.type > 2){
      notify('Unrecognized option.', 'error');
    }else{
      if(PVP_POOL[0][tamer.login] || PVP_POOL[1][tamer.login] || PVP_POOL[2][tamer.login]){
        notify('Already registered in another pool', 'error');
      }else{
        let battle_info = {
          entrance_time: new Date().getTime(), 
          rank: team_rank_calculator(data.type, TAMER_LIST[tamer.login].party),            
        } 
        PVP_POOL[data.type][tamer.login] = battle_info;
        socket.emit('pvp_entrance_accept', {type:data.type});
        pvp_matcher(data.type);
      }
    }
  });

  socket.on('pvp_exit_pool', (data) => { 
    exit_pvp_pool();
  });

  function exit_pvp_pool(){
    for(let i = 0; i < PVP_POOL.length; i++){
      if(PVP_POOL[i][tamer.login]) {
        delete PVP_POOL[i][tamer.login];
        return true;
      };
    }
    notify('You are not in a pvp pool', 'error');
  }

  //PVP MATCHER  
  function pvp_matcher(type){
    for (const first in PVP_POOL[type]) {    
      for (const second in PVP_POOL[type]) {
        if(PVP_POOL[type][first].rank == PVP_POOL[type][second].rank && first != second){
          //Load both tamers team digimons

          let match_info = {
            [first]:{
              party: TAMER_LIST[first].party.configuration.slice(0, type + 1),
            },
            [second]:{
              party: TAMER_LIST[second].party.configuration.slice(0, type + 1),
            },
          };
          
          let battlers = {};
          for(let i = 0; i <= type ; i++){
            let challenger_digimon_id = TAMER_LIST[first].party.configuration[i].id;
            let challenged_digimon_id = TAMER_LIST[second].party.configuration[i].id;
            battlers[challenger_digimon_id] = TAMER_LIST[first].party.digimons[challenger_digimon_id];
            battlers[challenged_digimon_id] = TAMER_LIST[second].party.digimons[challenged_digimon_id];
          }

          
          //Register the battle
          let battle = Battle(match_info, battlers);

          let battle_id = BATTLES.push({battle: battle, cache_time: new Date().getTime()}) - 1;
          BATTLES[battle_id].battle.battle_id = battle_id;
          //Register tamer socket on a private room for battle;
          io.sockets.connected[TAMER_LIST[first].socket_id].join('battle_' + battle_id);
          io.sockets.connected[TAMER_LIST[second].socket_id].join('battle_' + battle_id);
          BATTLES[battle_id].battle.start_battle();
          delete PVP_POOL[type][first];
          delete PVP_POOL[type][second];
          break;
        }
      }    
    }
    
    console.log('Stoping MATCHER. No matchable players on pool.');
  }

//========================================================
// Pendulum
//========================================================

  socket.on('pendulum_swap',(data)=>{
    TAMER_LIST[tamer.login].pendulum.swap(data.digimon_id);
  });

  socket.on('poop_clean',(data) => {
    TAMER_LIST[tamer.login].pendulum.poop_clean();
  });

}