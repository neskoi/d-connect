//======================================================
// Variable Declaration
//======================================================

let my_digimon = document.querySelector('#tamermon');
let digimon_animation;

let item_target;
let selected_item = '';

let digivice_scale;
let digimons_list = [];
let inventory = {};
let myChart = null;
let my_login = '';
let my_party = {};
let party_config = {};

//Pendulum Vars
let active_digimon = 0;
let poops = {};

//Battle vars
let in_battle = false;
let timer;
let target_digimon;

//Interface vars
let digivice_menu = document.querySelector('#digivice-menu');
let digivice_screen = document.querySelector('#digivice.screen');

let item_list = document.querySelector('#item-list');
let skill_list = document.querySelector('#skill-list');

//======================================================
// General Config
//======================================================

AUDIO.bkg_music.addEventListener("canplaythrough", e => {
  e.target.loop = true;
  e.target.play();
});

//======================================================
// Digivice Functions
//======================================================

function digivice_resize(){
  let maindiv = document.querySelector('#maindiv');
  let digivice_shell = document.querySelector('#digivice-shell');

 if(maindiv.offsetHeight < digivice_shell.offsetHeight || maindiv.offsetWidth < digivice_shell.offsetWidth || document.querySelector('#resize-digivice').classList.contains('maximize')){
      digivice_scale =  Math.min(maindiv.offsetHeight / (digivice_shell.offsetHeight + 20), maindiv.offsetWidth / (digivice_shell.offsetWidth + 20));    
      digivice_shell.style.transform = `scale(${digivice_scale})`;
  }else{
      digivice_shell.style.transform = 'scale(1)';
  } 
}

document.querySelector('#resize-digivice').addEventListener('click', (e) => {
  if(e.target.classList.toggle('maximize')){
    local_config.setItem('digivice_maximize', '1');
  }else{
    local_config.setItem('digivice_maximize', '0');
  }
  digivice_resize();
});

window.addEventListener('load',()=>{
  if(parseInt(local_config.getItem('digivice_maximize'))){
    document.querySelector('#resize-digivice').className += ' maximize';
  }
  digivice_resize();
  document.querySelector('#loader').className += ' hide';
});

window.addEventListener('resize',()=>{
  digivice_resize();
});

socket.on('disconnect', () => {
  let online_light = document.querySelector('#online-light');
  online_light.style['background-color'] = 'red';
});

socket.on('self_information_update', (data) => {
  my_login = data.login;
  //precisa carregar antes da pagina
  localStorage.setItem('language', data.language);
  print_money(data.bit, data.docoin);
});

//Receives basic information about logged player
socket.on('self_inventory_update', (data) => {
  inventory = data.inventory;
  load_inventory(inventory, 'All');
  bkg_selector_print(inventory);
});

function print_money(bit, docoin){
  document.querySelector('#bit-amount').textContent = bit;
  document.querySelector('#docoin-amount').textContent = docoin;
}

socket.on('party_update', (data) => {
  my_party = data.my_party;
  party_config = data.party_config;
  fill_party_digimons_pics();
  fill_pendulum_party();
});

function load_inventory(inventory, category, searched = '*'){
  let item_list = document.querySelector('#item-list');
  item_list.innerHTML = '';
  for(const index in inventory){
    if(inventory[index].category.toLowerCase() == category.toLowerCase() || category == 'All' || index.toLowerCase().includes(searched.toLowerCase())){
      item_list.innerHTML += `<div class="folder-selectables item"><div>${index}</div><div>X<div class="item-quantity">${inventory[index].quantity}</div></div></div>`;
    }
  }
  if(item_list.innerHTML == ''){
    item_list.innerHTML = "You don't have items here."
  }
}

function bkg_selector_print(inventory){
  let bkg_list = document.querySelector('#bkg-list');
  for(const bkg in inventory){
    if(inventory[bkg].category != 'Background') continue;
      let new_bkg = document.createElement('div');
      new_bkg.className = 'bkg-image clickable-resize';
      new_bkg.style.backgroundImage = `url(/resources/images/backgrounds/${bkg}.webp)`;
      new_bkg.innerHTML = bkg;
      new_bkg.title = bkg;
      bkg_list.appendChild(new_bkg);
  }
}

function swap_screens(){
  let digivice_screen = document.querySelector('#digivice.screen');
  let combat_screen = document.querySelector('#digivice-combat.screen');  
  digivice_screen.classList.toggle('show');
  combat_screen.classList.toggle('show');
}

document.querySelector('#light-switch').addEventListener('click', (e) => {
  socket.emit('lights_switch');
});

function digimon_sprite_url(digimon){
  let digimon_sprite = digimon.specie;
  if(digimon.skin) {digimon_sprite += `_${digimon.skin}`;}
  return `url('/resources/images/digimons/${digimon.stage}/${digimon_sprite}.png`;
}

//======================================================
// [Digivice Menu] functions
//======================================================

function block_menu(){
  digivice_menu.style.pointerEvents = 'none';
}

function unblock_menu(){
  digivice_menu.style.pointerEvents = '';
}

(() => {
  let close = document.querySelectorAll('.digivice-window-close');
  close.forEach(element => {
    element.addEventListener('click', () => {
      digivice_window_close_all();
    });
  });
})()

digivice_menu.addEventListener('click', (e) => {
  if(e.target.parentElement.id == 'digivice-menu'){
    let window_holder = document.querySelector(`#${e.target.id}-window-holder`); 
    if(!window_holder) return;
    if(window_holder.classList.contains('show')){
      window_holder.classList.remove('show');
    }else{
      digivice_window_close_all();
      window_holder.className += ' show';
    }
  }
});

function digivice_window_close_all(){
  for(let i = 0; i < digivice_menu.childElementCount; i++){
    let window_name = digivice_menu.children[i].id;
    let window = document.querySelector(`#${window_name}-window-holder`) ;
    if(window) window.classList.remove('show');
  }
}

document.querySelector('#digimons.digivice.button').addEventListener('click', ()=>{
  if(!digimons_list.length > 0){
    socket.emit('get_digimon_list',{});
  }
});

document.querySelector('#digimons-side').addEventListener('click', (e) => {
  if(e.target.parentElement.id == 'digimons-side'){
    fill_digimon_info(my_party[e.target.innerHTML]);
  }
});

//drag handlers for digimon party arrangement
function dragstart_digimon_handler(e){
  let identification = JSON.stringify({from:e.target.parentElement.id, id: e.target.innerHTML})
  e.dataTransfer.setData("text/plain", identification);
  e.dataTransfer.setDragImage(e.target, -10, -10);
}

function dragover_digimon_handler(e){
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function drop_digimon_handler(e){
  e.preventDefault();
  let identification = JSON.parse(e.dataTransfer.getData("text"));
  let original_digimon = e.target.innerHTML;
  let arriving_digimon = identification.id;

  if(original_digimon == arriving_digimon){return}
  //todo remover swal
  if((original_digimon == active_digimon && !my_party[arriving_digimon]) ||
     (identification.from != 'digimons-list' && arriving_digimon == active_digimon && !my_party[original_digimon])){
    swal({
      icon: "error",
      title: "Not Allowed",
      text: "You can't remove the active digimon, change it on pendulum first."
    });
    return;
  }

  if(e.target.parentElement.id == 'digimons-side'){
    if(my_party[original_digimon] && my_party[arriving_digimon]){
      socket.emit('swap_digimon_inside_party', {old_id: original_digimon, new_id: arriving_digimon});
    }else if(my_party[original_digimon]){
      socket.emit('swap_digimon', {old_id: original_digimon, new_id: arriving_digimon});
    }else if(!my_party[arriving_digimon]){
      socket.emit('add_digimon_party', {id:arriving_digimon});
    }
  }else{
    if(my_party[arriving_digimon] && identification.from != 'digimons-list'){
      socket.emit('remove_digimon_party', {id: arriving_digimon});
    }
  }
  
}

(() => {
  let digimons_side_pics = document.querySelector('#digimons-side');
  for(let i = 0; i < digimons_side_pics.childElementCount; i++){
    let digimon_pic =  digimons_side_pics.children[i];
    digimon_pic.addEventListener('dragstart',(e) => {dragstart_digimon_handler(e); fill_digimon_info(my_party[e.target.textContent])});
    digimon_pic.addEventListener('dragover',(e) => {dragover_digimon_handler(e)});
    digimon_pic.addEventListener('drop',(e)=>{drop_digimon_handler(e)});
  }
})()

//Print the digimons pic at left side on digimons screen
function fill_party_digimons_pics(){
  let digimons_side_pics = document.querySelector('#digimons-side');
  for(let i = 0; i < digimons_side_pics.childElementCount; i++){
    let digimon_pic =  digimons_side_pics.children[i];
    if(party_config[i]){
      digimon_pic.style.backgroundImage = digimon_sprite_url(my_party[party_config[i].id]);
      digimon_pic.innerHTML = my_party[party_config[i].id].id;
      digimon_pic.title = my_party[party_config[i].id].name;
      digimon_pic.draggable = true;
    }else{
      digimon_pic.style.backgroundImage = '';
      digimon_pic.innerHTML = '';
      digimon_pic.title = '';
      digimon_pic.draggable = false;
    }
  }
}

//Print the on left side on digivice screen
function fill_pendulum_party(){
  let pendulum_box = document.querySelector('#pendulum-box');
  pendulum_box.parentElement.className = 'show';
  let digimons = party_config.filter(digimon => digimon.id != active_digimon);
  for(let i = 0; i < pendulum_box.childElementCount; i++){
    if(!digimons[i]){
      pendulum_box.children[i].classList.remove('show');
      continue;
    }
    pendulum_box.children[i].className += ' show';
    pendulum_box.children[i].style['pointer-events'] = 'auto';                 
    pendulum_box.children[i].title = my_party[digimons[i].id].name;   
    pendulum_box.children[i].innerHTML = digimons[i].id;       
    pendulum_box.children[i].style.backgroundImage = digimon_sprite_url(my_party[digimons[i].id]);
  }
  if(party_config.length == 1){
    pendulum_box.parentElement.className = '';
  } 
}

socket.on('digimons_list',(data) => {
  digimons_list = data.digimons_from_page;
  fill_digimon_list(digimons_list);
  fill_digimon_list_page_selector(data.digimons_per_page, data.total_digimons, data.page_number);
});

document.querySelector('#digimons-list').addEventListener('dragover',(e) => {dragover_digimon_handler(e)});

document.querySelector('#digimons-list').addEventListener('drop',(e)=>{drop_digimon_handler(e)});

function fill_digimon_list(digimons){
  let digimons_list = document.querySelector('#digimons-list');
  digimons_list.innerHTML = '';
  digimons.forEach(digimon => {
    let new_digi = document.createElement('div');
    new_digi.classNam = "digimon-sprite";
    new_digi.style.backgroundSize = '96px 160px';
    new_digi.style.backgroundImage = digimon_sprite_url(digimon);
    new_digi.title = digimon.name;
    new_digi.innerHTML = digimon.id;
    new_digi.addEventListener('click', () => { fill_digimon_info(digimon)});
    new_digi.draggable = true;
    new_digi.addEventListener('dragstart',(e) => {dragstart_digimon_handler(e); fill_digimon_info(digimon);});
    digimons_list.appendChild(new_digi);
  })
}

function fill_digimon_info(digimon){
  if(!digimon){
    return;
  }
  let selected_digimon_pic = document.querySelector('#selected-digimon-pic'),
  selected_digimon_status = document.querySelector('#selected-digimon-status'),
  selected_digimon_weight = document.querySelector('#selected-digimon-weight'),
  selected_digimon_age = document.querySelector('#selected-digimon-age'),
  selected_digimon_battles = document.querySelector('#selected-digimon-battles'),
  selected_digimon_victories = document.querySelector('#selected-digimon-victories'),
  selected_digimon_name = document.querySelector('#selected-digimon-name'),
  selected_digimon_change_name = document.querySelector('#selected-digimon-change-name'),
  selected_digimon_lvl = document.querySelector('#selected-digimon-lvl');
  selected_digimon_specie = document.querySelector('#selected-digimon-specie'),
  selected_digimon_types = document.querySelector('#selected-digimon-types'),
  selected_digimon_stage = document.querySelector('#selected-digimon-stage'),
  selected_digimon_personality = document.querySelector('#selected-digimon-personality');

  //Digimon image
  selected_digimon_pic.innerHTML = digimon.id;
  selected_digimon_pic.style.backgroundImage = digimon_sprite_url(digimon);
  
  //Digimon types
  selected_digimon_types.children[0].className = `digivice-sprite attribute ${digimon.attribute}`;
  selected_digimon_types.children[0].title = digimon.attribute;
  selected_digimon_types.children[1].className = `digivice-sprite element ${digimon.element}`;
  selected_digimon_types.children[1].title = digimon.element;
  selected_digimon_types.children[2].className = `digivice-sprite field ${digimon.field}`;
  selected_digimon_types.children[2].title = digimon.field;

  //Digimon status
  selected_digimon_status.children[0].title = Math.round(digimon.status.hunger/10);
  selected_digimon_status.children[1].title = Math.round(digimon.status.energy/10);
  selected_digimon_status.children[2].title = Math.round(digimon.status.joy/10);
  selected_digimon_status.children[3].title = Math.round(digimon.status.health/10);
  selected_digimon_status.children[4].title = Math.round(digimon.status.bond/10);

  //Data pieces
  selected_digimon_weight.children[1].innerHTML = digimon.weight;
  selected_digimon_age.children[1].innerHTML = digimon.age;
  selected_digimon_battles.children[1].innerHTML = digimon.battles;
  selected_digimon_victories.children[1].innerHTML = digimon.victories;

  //Digimon basic info
  selected_digimon_name.children[1].innerHTML = digimon.name;
  if(digimon.name == 'Digimon'){
    selected_digimon_change_name.classList.add('show');
  }else{
    selected_digimon_change_name.classList.remove('show');
  }
  selected_digimon_lvl.children[1].innerHTML = digimon.lvl;
  selected_digimon_specie.children[1].innerHTML = digimon.specie;
  selected_digimon_stage.children[1].innerHTML = digimon.stage;
  selected_digimon_personality.children[1].innerHTML = digimon.personality;

  graph_generator(digimon.stats.con, digimon.stats.int, digimon.stats.atk, digimon.stats.def, digimon.stats.tec, digimon.stats.spd);
}

document.querySelector('#digimons-list-page-selector').addEventListener('click', (e) => {
  let page;
  if(e.target.parentElement.id == 'digimons-list-page-selector'){
    if(e.target.classList.contains('page-limit')){
      page = e.target.children[0].innerHTML;
    }else{
      page = e.target.innerHTML;
    }
    if(e.target.innerHTML != '•'){
      socket.emit('get_digimon_list',{page:page});
    }
  }
});

function fill_digimon_list_page_selector(digimons_per_page, total_digimons, page_number){
  let total_pages = Math.ceil(total_digimons/digimons_per_page);
  let page_selector = document.querySelector('#digimons-list-page-selector');
  page_number = parseInt(page_number);
  if(total_pages > 1){
    page_selector.className = 'show';
    page_selector.children[0].children[0].innerHTML = 1;
    page_selector.children[6].children[0].innerHTML = total_pages;
    for(let i = 1; i < page_selector.childElementCount - 1; i++){
      let page = i - 3 + page_number;
      if(page > 0 && page <= total_pages){
        page_selector.children[i].innerHTML = page;
      }else{
        page_selector.children[i].innerHTML = '•';
      }
    }
  }else{
    page_selector.className = '';
  }
}

async function digimon_change_name(){
  let digimon_id = document.querySelector('#selected-digimon-pic').innerHTML;
  let confimartion =  await swal({
    icon: "warning",
    title: "Deseja trocar o nome desse digimon?",
    text: "Isso pode ser feito apenas uma vez.",
    closeOnClickOutside: false,
    buttons:{
      yes:{
        text: `Yes`,
        value: true,
        visible: true,
        closeModal: true,
      },
      no:{
        text: `No`,
        value: false,
        visible: true,
        closeModal: true,
      }
    }
  });
  
  if(confimartion){
    let new_name = await swal({
      title: "Insira o nome desejado:",
      content: {
        element: "input",
        attributes: {
          placeholder: "Novo nome",
        },
      },
    })
    if(!new_name){return;}
    if(new_name.length < 1 || new_name.length > 20){
      swal({
        icon:"error",
        text: "O nome deve ter entre 1 e 20 caracteres."
      });
    }else{
      swal({
        icon:"success",
        text: "O nome foi alterado."
      });
      socket.emit('digimon_change_name',{digimon_id: digimon_id, new_name: new_name});
    }
  }
}

document.querySelector('#selected-digimon-change-name').addEventListener('click', () =>{
  digimon_change_name();
}),

graph_generator(null,null,null,null,null,null);

function graph_generator(con, int, atk, def, tec, spd){
  let incoming_data = [con, def, spd, int, tec, atk];
  let canvas = document.getElementById('selected-digimon-graph');
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(myChart){
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['CON', 'DEF', 'SPD', 'INT', 'TEC', 'ATK'],
      datasets: [{
          data: incoming_data,
          backgroundColor: 'rgba(242, 154, 2, 0.5)',
          borderColor: 'purple',
          pointBackgroundColor:'red',
          pointBorderColor: 'transparent',
          pointHoverBackgroundColor: 'green',
          pointRadius: 4,
          pointHoverRadius: 5,
      }]
  },
  options :{
    responsive: true,
    maintainAspectRatio: false,
    
    legend:{
      display: false,
    },
    tooltips:{
      bodyAlign: 'center',
      displayColors: false,
      callbacks:{
        title: function(tooltipItem, data) {
          let stats =  data.labels[tooltipItem[0].index];
          return stats;
        }
      }
    },
    scale: {
        gridLines: {
          //display:false,
          color: 'rgba(255, 255, 255, 0.2)',
        },
        angleLines: {
          display: false,
        },
        ticks: {
          display: false,
          maxTicksLimit: 4,
          beginAtZero: true,
  
        },
        pointLabels:{
          fontColor: 'white',
        },
    },
  }
  });

  function steps_size_force(){
    let step_size = Math.max(...incoming_data) / 5;
    console.log(step_size)
    return step_size;
  }
}

document.querySelector('#selected-digimon-buttons').addEventListener('click',((e) => {
  if(e.target.parentElement.id == 'selected-digimon-buttons'){
    if(e.target.id == 'send-to-party'){
      send_to_party(document.querySelector('#selected-digimon-pic').innerHTML);
    }
  }
}));

function send_to_party(){
  if(party_config.length >= 3){
    let clone = document.querySelector('#digimons-side').cloneNode(true);
    swal({
      title: "A party esta cheia",
      text: "Selecione um digimon para trocar de lugar.",
      button: false,
      content: clone,
      
    })
  }
}

//background selector
function move_bkg_list(direction){
  let bkg_list = document.querySelector('#bkg-list');
  let position = parseInt(bkg_list.style.left) || 0;
  if(!direction){
    if(position > (bkg_list.childElementCount - 3) * - 140  && bkg_list.childElementCount > 3){
      let move = position - 140;
      document.querySelector('#bkg-list').style.left = `${move}px`
    }
  }else{
    if(position < (bkg_list.childElementCount - 1) * 140 && position < 0){
      let move = position + 140;
      document.querySelector('#bkg-list').style.left = `${move}px`
    }
  }
}

document.querySelector('#bkg-list-left').addEventListener('click', (e) => {
  move_bkg_list(0);  
});

document.querySelector('#bkg-list-right').addEventListener('click', (e) => {
  move_bkg_list(1);  
});

document.querySelector('#bkg-list').addEventListener('click',(e) => {
  if(e.target.parentElement.id == 'bkg-list'){
    let bkg = e.target.innerHTML;
    socket.emit('change_pendulum_bkg', {bkg});
  }
});

//======================================================
// [Bag] functions
//======================================================

document.querySelector('#search-item').addEventListener('input', (e) => {
  if(e.target.value != ''){
    document.querySelector('#category-name').children[0].innerHTML = 'Search'
    load_inventory(inventory, 'Search', e.target.value);
  }
});

document.querySelector('#category-list').addEventListener('click', (e) => {
  if(e.target.id == ''){
    document.querySelector('#search-item').value = '';
    document.querySelector('#category-name').children[0].innerHTML = e.target.textContent;
    load_inventory(inventory, e.target.textContent);
  }
});

item_list.addEventListener('click', (e)=>{
  let item_description = document.querySelector('#item-description');
  let name = e.target.children[0].innerHTML;
  let description = inventory[name].description;
  if(!e.target.id){
    item_description.children[0].innerHTML = name;
    item_description.children[1].innerHTML = description;
    selected_item = name;
  }
});

document.querySelector('#item-use').addEventListener('click', async ()=>{
  if(!selected_item){
    swal({text: `Select a item before use.`});
  }else{
    if(!in_battle){
      socket.emit('use_item',{item: selected_item});
    }else{
      let select_item_target = document.querySelector('#digimons-side').cloneNode(true);
      select_item_target.id = 'item-target-select-digimon';

      for(let i = 0; i < select_item_target.childElementCount; i++){
        if(document.querySelector(`#digimon_${select_item_target.children[i].innerHTML}_pic`)){
          select_item_target.children[i].draggable = false;
          select_item_target.children[i].addEventListener('click',(e) => {
            item_target =  e.target.innerHTML;
            swal.close();
          });
        }else{
          select_item_target.children[i].remove();
          i--;
        }
      }

      swal({
        title: `Choose the target of your item!`,
        text: `Choose one:`,
        button: false,
        content: select_item_target,
      }).then(()=>{
        if(item_target){
          socket.emit('use_item_battle',{item: selected_item, target_digimon: item_target});
          digivice_window_close_all();
          item_target = undefined;
        }
      });
    }
  }
});

//========================================================
// PVP 
//========================================================
function exit_pvp_pool(){
  let pvp_banner = document.querySelector('#pvp-banner');
  for(let i = 0; i < pvp_banner.childElementCount; i++){
    if(pvp_banner.children[i].children[0].classList.contains('loading')){  
      socket.emit('pvp_exit_pool');
      pvp_banner.children[i].children[0].classList.remove('loading');
      pvp_banner.children[i].children[1].classList.remove('show');
      pvp_banner.children[i].classList.add('button');
    }
  }
}

document.querySelector('#pvp-banner').addEventListener('click',(e) => {
  if(e.target.parentElement.id == 'pvp-banner'){
    let type = parseInt(e.target.id.slice(5)) - 1;
    if(e.target.children[0].classList.contains('loading')){  
      exit_pvp_pool();
    }else{
      exit_pvp_pool();
      socket.emit('pvp_enter_pool', {type: type});
    }  
  }
});

document.querySelector('#pvp-window-holder').addEventListener('transitionend',(e) => {
  if(e.target.id == 'pvp-window-holder' && !in_battle){
    exit_pvp_pool();
  }
});

socket.on('pvp_battle_start',(data) => { 
  in_battle = true;
  digivice_window_close_all();

  block_menu();

  music_swaper(AUDIO.bkg_music, AUDIO.battle_music);

  turn_controller(data.battlers, data.turn_order, data.turn_pointer);

  order_indicator_load(data.battlers, data.turn_order, data.turn_pointer);     

  fill_battlefield(data.battlers);
  
  self_hud_party(data.digimons_in_battle[my_login]);

  self_hud_load(data.battlers, data.digimons_in_battle, data.turn_order, data.turn_pointer);

  turn_notifier(data.battlers, data.turn_order, data.turn_pointer);

  swap_screens();    

});

socket.on('update_battle', (data) => {
  digivice_window_close_all();
  update_battle(data);
});

socket.on('pvp_entrance_accept',(data) => {
  let pvp_banner = document.querySelector(`#pvp-x${data.type + 1}`);
  pvp_banner.classList.remove('button');
  pvp_banner.children[0].classList.add('loading');
  pvp_banner.children[1].classList.add('show');
});

function pvp_battle_end(winner){
  let combat_result = document.querySelector('#combat-result');
  combat_result.classList.add('show');

  let combat_result_winner = document.querySelector('#combat-result p.winner');
  let combat_result_timer = document.querySelector('#combat-result p.time');
  combat_result_winner.innerHTML += ` ${winner}`;
  stop_timer();
  start_timer(16, combat_result_timer);

  if(winner == my_login){
    AUDIO.win.play();
  }else{
    AUDIO.lose.play();
  }

  in_battle = false;
  unblock_menu();
}

function update_battle(data){

  verbose(data.battle_log, data.happened).then(() => {
    turn_controller(data.battlers, data.turn_order, data.turn_pointer);

    fill_battlefield(data.battlers);
    
    self_hud_load(data.battlers, data.digimons_in_battle, data.turn_order, data.turn_pointer);

    turn_notifier(data.battlers, data.turn_order, data.turn_pointer);
  });

  failure_print(data.failure[my_login]);
  
  order_indicator_load(data.battlers, data.turn_order, data.turn_pointer);     

}

//========================================================
// PVP general info print
//========================================================

function failure_print(failure){
  if(failure){
    let fails = document.querySelector('#failure-counter');
    for(let index = 0; index < failure; index++){
      if(!fails.children[index].classList.contains('fail')){
        AUDIO.error.play();
        fails.children[index].classList.add('fail');
      }
    }
  }
}

function turn_notifier(battlers, turn_order, turn_pointer){
  if(battlers[turn_order[turn_pointer]].tamer == my_login){
    console.log('Your Turn.');
  }else{
    console.log('Opponent"s turn');
  }
}

function order_indicator_load(battlers, turn_order, turn_pointer){
  let turn_indicator = document.querySelector('#turn-indicator');
  let actual = 0;
  for(let i = 0; i  < 4; i++){
      if(turn_pointer + i < 20){
        actual = turn_order[turn_pointer + i];
      }else{
        actual = turn_order[(turn_pointer + i) - 20];
      }
      for (const digimon in battlers) {
         if(battlers[digimon].digimon_id ==  actual){
              let image = digimon_sprite_url(battlers[digimon]);
              turn_indicator.children[3 - i].style.backgroundImage = image;
              //turn_indicator.children[3 - i].style.backgroundPosition = '-20px -5px';
              turn_indicator.children[3 - i].title = battlers[digimon].digimon_name;

              if(battlers[digimon].tamer != my_login){
                turn_indicator.children[3-i].style.border = '2px groove red';
                turn_indicator.children[3-i].style.borderRight = 'none';
              }else{
                turn_indicator.children[3-i].style.border = '';
              }
              break;
         }
      }    
  } 
}

function turn_controller(battlers, turn_order, turn_pointer){
  if(in_battle){
    let turn_counter = document.querySelector('#turn-counter');
    stop_timer();
    start_timer(30, turn_counter.children[1]);
    let combat_options = document.querySelector('#combat-options');
    for (const digimon in battlers) {
      if(turn_order[turn_pointer] == battlers[digimon].digimon_id && my_login == battlers[digimon].tamer){
          for(let i = 0; i < 3; i++){
              combat_options.children[i].style['pointer-events'] = 'auto';
          }
          turn_counter.children[0].innerHTML = 'Your Turn';
          break;
      }else{
          for(let i = 0; i < 3; i++){
              combat_options.children[i].style['pointer-events'] = 'none';
          }
          turn_counter.children[0].innerHTML = 'Enemy Turn';
      }
    } 
  } 
}

function battle_log_generator(battle_log){
  let text = [];
  battle_log.forEach(element => {
    let action = {
      attack: `${element.starter} attack's ${element.target} and hits for ${element.value} damage.`,
      did_nothing: `${element.starter} did nothing. (Are you here?)`,
      faint: `${element.starter} has fainted.`,
      item: `${element.starter} uses ${element.target}.`,
      skill: `${element.starter} uses ${element.with_what} on ${element.target} dealing ${element.value} damage.`,
      
      heal: `It heals ${element.value}.`,
      revive: `It's a mircle! ${element.target} revives.`,

      infection: `${element.target} is infected.`,
      silence: `${element.target} is silenced.`,
      sleep: `${element.target} is asleep.`,
      stun: `${element.target} is stunned.`,

      abnormal_status_infection_end: `${element.starter} infection has ended.`,
      abnormal_status_silence_end: `${element.starter} silence has ended.`,
      abnormal_status_sleep_end: `${element.starter} awake.`,
      abnormal_status_stun_end: `${element.starter} stun has ended.`,

      buff_con: `${element.starter} constituition has been buffed.`,
      buff_int: `${element.starter} inteligence has been buffed.`,
      buff_atk: `${element.starter} attack has been buffed.`,
      buff_def: `${element.starter} defence has been buffed.`,
      buff_tec: `${element.starter} technic has been buffed.`,
      buff_spd: `${element.starter} speed has been buffed`,

      buff_con_end: `${element.starter} constituition buff has ended.`,
      buff_int_end: `${element.starter} inteligence buff has ended.`,
      buff_atk_end: `${element.starter} attack buff has ended.`,
      buff_def_end: `${element.starter} defence buff has ended.`,
      buff_tec_end: `${element.starter} technic buff has ended.`,
      buff_spd_end: `${element.starter} speed buff has ended.`,

      debuff_con: `${element.starter} constituition has been debuffed.`,
      debuff_int: `${element.starter} inteligence has been debuffed.`,
      debuff_atk: `${element.starter} attack has been debuffed.`,
      debuff_def: `${element.starter} defence has been debuffed.`,
      debuff_tec: `${element.starter} technic has been debuffed.`,
      debuff_spd: `${element.starter} speed has been debuffed`,

      debuff_con_end: `${element.starter} constituition debuff has ended.`,
      debuff_int_end: `${element.starter} inteligence debuff has ended.`,
      debuff_atk_end: `${element.starter} attack debuff has ended.`,
      debuff_def_end: `${element.starter} defence debuff has ended.`,
      debuff_tec_end: `${element.starter} technic debuff has ended.`,
      debuff_spd_end: `${element.starter} speed debuff has ended.`,
      
      cure_infection: ' and the infection has been cured.',
      cure_silence: ' and the infection has been cured.',
      cure_sleep: ' and the infection has been cured.',
      cure_stun: ' and the infection has been cured.',
  
      left: `${element.starter} has disconnected.`,
    }

    text.push(action[element.event]);

  });
  return text;
}

function verbose(battle_log, happened){
  return new Promise((resolve)=>{
    let counter = 0;
    text = battle_log_generator(battle_log);
    if(text != null){

      let verbose = document.querySelector('#verbose');
      let self_hud_interface = document.querySelector('#self-hud-interface');
      self_hud_interface.style.display = 'none';
      verbose.classList.add('show');

      verbose.innerHTML = text[counter];

      if(happened[counter]){
        action_analyzer(happened[counter]);
      }

      counter++;

      let show_text = setInterval(() => {
        if(counter >= text.length){
          verbose.classList.remove('show');
          self_hud_interface.style.display = '';
          clearInterval(show_text);
          resolve();
        }
        verbose.textContent = text[counter];

        if(happened[counter]){
          action_analyzer(happened[counter]);
        }

        counter++;
      }, 2000);
    }  
  })
}

//========================================================
// PVP battlefield control
//========================================================

function fill_battlefield(battlers){
  let image = '';
  let title = '';
  let enemy_info = [];
  for(const index in battlers){     
      if(battlers[index].tamer != my_login){   
          if(battlers[index].hp > 0){
              image = digimon_sprite_url(battlers[index]);
              title = `${battlers[index].digimon_name}\nHP: ${battlers[index].hp}/${battlers[index].max_hp}\nSP: ${battlers[index].sp}/${battlers[index].max_sp}`;
          }else{
              if(battlers[index].digimon_id == target_digimon){target_digimon = 0;}
              image = '';
              title = '';
          }
          enemy_info.push({image:image, title: title, id: battlers[index].digimon_id});
      }
  }

  if(enemy_info.length == 1) {
      fill_enemy(0, 1, 0, enemy_info);
  }else if(enemy_info.length < 4) {
      for (let i = 0; i < enemy_info.length; i++) {
          fill_enemy(0, i, i, enemy_info);
      }
  }else{
      //todo make it better
      for (let i = 0; i < 2; i++) {
          fill_enemy(1, i, enemy_info);        
          fill_enemy(0, i + 1, enemy_info);               
      }
  }
}


//remover call de animacao e lister de dentro da classe, aproveitar e mudar o comportamento da quantidadee de inimigos na batalha.
//modificar animacao de ataque do oponente pra remover timeout
function fill_enemy(y, x, id, enemy_info){
  let enemy_group = document.querySelector('#enemy-group');
  let enemy_digimon = enemy_group.children[y].children[x];
  enemy_digimon.id = `digimon_${enemy_info[id].id}`;
  enemy_digimon.style.backgroundImage = enemy_info[id].image;
  enemy_digimon.title = enemy_info[id].title;
  enemy_digimon.innerHTML = enemy_info[id].id;
  
  //todo dar uma forma melhor para n dar multiplas calls na animacao
  if(typeof enemy_group.children[y].children[x].move === 'undefined'){
    battle_animation(enemy_group.children[y].children[x]);
  }

  enemy_digimon.addEventListener('click', (e) => {
    if(e.target.classList.contains('enemy')){
      if(typeof target_digimon !== 'undefined'){
        target_digimon.selected.cancel();
      }        
      target_digimon =  e.target;
      target_digimon.selected.play();
    } 
  });
}

//========================================================
// PVP self information print
//========================================================

function self_hud_party(digimons_in_battle){
  document.querySelector('.self-digimon-info.actual').style.display = 'flex';
  if(digimons_in_battle > 1){
    document.querySelector('#party-hud').style.display = 'flex';
    document.querySelector('.self-digimon-info.second').style.display = 'flex';
    if(digimons_in_battle == 2){return;}
    document.querySelector('.self-digimon-info.third').style.display = 'flex';
  }
}

function self_hud_load(battlers, digimons_in_battle, turn_order, turn_pointer){
  let turns = turn_order.length;
  let founded = [];
  //look beginig from actual turn if found my digimons act time.
  for(let i = turn_pointer; i < turns; i++){
    for (const digimon in my_party) {
      if(turn_order[i] == parseInt(digimon) && !founded.includes(digimon)){
        position_selector(digimon);
        if(founded.length >= digimons_in_battle[my_login]){
          return;
        }
      }
    }
    if(i == 19){ 
      i = 0;
      turns = turn_pointer;
    }
  }

  //if a digimon is fainted, he dont be in turn order, but still in battle.
  if(founded.length < digimons_in_battle[my_login]){
    for(const digimon in my_party){
      if(!founded.includes(parseInt(digimon)) && battlers.hasOwnProperty(digimon)){
        position_selector(digimon);
      }
      if(founded.length >= digimons_in_battle[my_login]){
        break;
      }
    }    

    //special for fainted digimons.
    let infos = document.querySelectorAll('.self-digimon-info');
    infos.forEach(element => {
      if(!turn_order.includes(parseInt(element.firstElementChild.innerHTML))){
        element.style.filter = 'grayscale(100%)';
      }else{
        element.style.filter = '';
      }
    })
  }

  function position_selector(digimon){
    if(founded.length == 0){
      print_digimon_info('actual', battlers[digimon]);
      print_skills(digimon);
    } else if(founded.length == 1){
      print_digimon_info('second', battlers[digimon]);
    }else{
      print_digimon_info('third', battlers[digimon]);
    }
    founded.push(digimon);
  }
}

function print_digimon_info(position, digimon){
  let buff_status = document.querySelector(`.self-digimon-info.${position} > .hpsp-display > .buff-status > .holder`);
  let own_digimon_pic = document.querySelector(`.self-digimon-info.${[position]} > .own-digimon-pic`);
  let digimon_hp = document.querySelector(`.self-digimon-info.${position} > .hpsp-display > .metter > .digimon-hp`);
  let digimon_hp_shadow = digimon_hp.parentElement;
  let digimon_sp = document.querySelector(`.self-digimon-info.${position} > .hpsp-display > .metter > .digimon-sp`);
  let digimon_sp_shadow = digimon_sp.parentElement;
  let hp_bar_lenght = 0;
  let sp_bar_lenght = 0;

  own_digimon_pic.classList.remove('selected');
  own_digimon_pic.style.filter = '';
  own_digimon_pic.id = `digimon_${digimon.digimon_id}_pic`
  own_digimon_pic.innerHTML = digimon.digimon_id;
  own_digimon_pic.title = digimon.digimon_name
  own_digimon_pic.style.backgroundImage = digimon_sprite_url(digimon);         
  
  hp_bar_lenght = Math.round(((digimon.hp*100)/digimon.max_hp)*1.46);
  digimon_hp.style.width = hp_bar_lenght+"px";
  digimon_hp_shadow.title = digimon_hp.title;
  digimon_hp.title = `${digimon.hp}/${digimon.max_hp}`;

  sp_bar_lenght = Math.round(((digimon.sp*100)/digimon.max_sp)*1.46);
  digimon_sp.style.width = sp_bar_lenght+"px";
  digimon_sp.title = `${digimon.sp}/${digimon.max_sp}`;
  digimon_sp_shadow.title = digimon_sp.title;

  buff_status.innerHTML = '';
  abnormal_buff_debuff_print(buff_status, digimon);
}

//todo checar a troca de classes
function abnormal_buff_debuff_print(buff_status, digimon){
  let status_adresses = {
  abnormal_status:{
    infection: '-112px -144px',
    silence: '-112px -128px',
    sleep: '-96px -128px',
    stun: '-96px -144px',
  },
  buff:{
    con: '0px -128px',
    int: '-16px -128px',
    atk: '-32px -128px',
    def: '-48px -128px',
    tec: '-64px -128px',
    spd: '-80px -128px',
  },
  debuff:{
    con: '0px -144px',
    int: '-16px -144px',
    atk: '-32px -144px',
    def: '-48px -144px',
    tec: '-64px -144px',
    spd: '-80px -144px',
  }}

  for(const index in status_adresses){
    if(Object.keys(digimon[index]).length){
      for(const stats in digimon[index]){
        let stat_icon = document.createElement('div');
        stat_icon.id = stats;
        stat_icon.title = stats.charAt(0).toUpperCase() + stats.slice(1);
        stat_icon.classList.add('digivice-sprite');
        stat_icon.style.backgroundPosition = status_adresses[index][stats];
        buff_status.appendChild(stat_icon);
      }
    }
  } 

  buff_status.classList.remove('bars-2');
  buff_status.classList.remove('bars-3');
  buff_status.classList.remove('bars-4');

  if(buff_status.children.length > 12){
    buff_status.classList.add('bars-4');
  }else if(buff_status.children.length > 8){
    buff_status.classList.add('bars-3');
  }else if(buff_status.children.length > 4){
    buff_status.classList.add('bars-2');
  }
}

function print_skills(digimon){
  skill_list.innerHTML = '';
  let i = 0;
  for(const index in my_party[digimon].skills){
      skill_list.innerHTML += `<div>${my_party[digimon].skills[index]}</div>`;
      //todo re inserir description da skill
      //let cost = my_party[digimon].skills[index].cost;
      //let description = my_party[digimon].skills[index].description;
      //skill_list.children[i].title = `Cost: ${cost}\nDescription: ${description}`;
      i++;
  }
}

//========================================================
// Combat Actions Animations and Analysis
//========================================================

function action_analyzer(happened){
  if(happened.event == 'attack'){
    opponent_attack(happened.starter, happened.defender);
  }else if(happened.event == 'item'){
    use_item_animation(happened.starter);
  }else if(happened.event == 'skill'){
    opponent_attack(happened.starter, happened.defender);
  }else if(happened.event == 'faint'){
    battle_faint(happened.starter, happened.defender);
  }else if(happened.event == 'end'){
    pvp_battle_end(happened.starter);
  }
}

function opponent_attack(attacker, target){
  if(typeof my_party[attacker] === 'undefined' && attacker != null){
    let digimon = document.querySelector(`#digimon_${attacker}`);
    let target_pic = document.querySelector(`#digimon_${target}_pic`);
    digimon.move.cancel();
    digimon.style.backgroundPosition = '-96px -384px';
    target_pic.style.backgroundPosition = '-288px -372px';
    AUDIO.hit.play();
    setTimeout(() => {
      digimon.style.backgroundPosition = '';
      digimon.move.play();
      target_pic.style.backgroundPosition = '';
    }, 1000);
  }
}

function use_item_animation(who){
  AUDIO.use_item.play();
}

function battle_faint(who){
  let digimon = document.querySelector(`#digimon_${who}`);
  if(digimon){
    digimon.move.cancel();
    digimon.faint.play();
  }
}

function attacked(){
  target_digimon.move.cancel();
  AUDIO.hit.play();
  target_digimon.attacked.play();
  target_digimon.attacked.onfinish = () =>{
    target_digimon.move.play();
  }
}

//========================================================
// PVP Timer Function
//========================================================

function start_timer(time, element){  
  time > 9 ? element.innerHTML = `00:${time}` : element.innerHTML = `00:0${time}`;
  clearInterval(timer);        
  timer = (setInterval(()=>{
    if(time == 0){
      clearInterval(timer);        
    }
    else{
        time--;
    }
    time > 9 ? element.innerHTML = `00:${time}` : element.innerHTML = `00:0${time}`;  
  }, 1000));
}

function stop_timer(){
  clearInterval(timer);
}

//========================================================
// PVP Combat self hud buttons
//========================================================

document.querySelector('#combat-options').addEventListener('click', (e) => {
  switch(e.target.id || e.target.parentElement.id){
    case 'atk':
        attack();
      break;
      case 'folder':
        document.querySelector('#folder.digivice.button').click();
      break;
    case 'giveup':
        give_up();
      break;
  }
});

function attack(){
  if(target_digimon != undefined && target_digimon.innerHTML != '' && target_digimon.style.backgroundImage != ''){
    attacked();
    socket.emit('attack', {target_digimon: target_digimon.innerHTML});
  }else{
    swal({
      title: `Where are you looking for?`,
      text: `Target someone before attack.`,
    });
  }
}

function give_up(){
  swal({
    title: `Are you sure?`,
    text: `You will run away like a coward chicken?`,
    buttons:{
      yes: true,
      no:{},
    }
  }).then(answer => {
    if(answer){
      socket.emit('give_up');
    }
  });
}

skill_list.addEventListener('click', (e) => {
  if(target_digimon != undefined && target_digimon.innerHTML != ''){
    if(!e.target.id){
      socket.emit('skill', {skill: e.target.innerHTML, target_digimon: target_digimon.innerHTML});
    }    
  }else{
    swal({
      title: `Where are you looking for?`,
      text: `Target someone before use the skill.`,
    });
  }
});

//========================================================
// Pendulum
//========================================================

socket.on('pendulum_loop', (data) => {
    active_digimon = data.active_digimon;
    hapiness_analyze(data);
    fill_pendulum_party();
    status_loader(data);
    poop_time(data);
    poop_render(digivice_screen, data);
    lights_switch();
    bkg_placer();
    digimon_sprite_size_set(data);
    digimon_speak(data);
});       

function digimon_sprite_size_set(data){
  let digimon = document.querySelector('#tamermon');
  let evostage = my_party[data.active_digimon].stage;
  if(evostage == 'Armor' || evostage == 'Burst-Mode' || evostage == 'Jogress' || evostage == 'Ultimate' || evostage == 'Ultra'){
    digimon.style.height = '192px';
    digimon.style.width = '192px';
  }else if(evostage == 'Perfect'){
    digimon.style.height = '160px';
    digimon.style.width = '160px';
  }else if(evostage == 'Adult'){
    digimon.style.height = '128px';
    digimon.style.width = '128px';
  }else{
    digimon.style.height = '96px';
    digimon.style.width = '96px';
  }
  digimon.style.backgroundImage = digimon_sprite_url(my_party[data.active_digimon]);
}

//todo improve this
function status_loader(data){
  let value = 0;

  let hungry = document.querySelector('#hungry');
  value = (Math.floor(((data.hunger*32)/100)));
  hungry.style.height = value + 'px';
  hungry.style.backgroundPositionY = `${-32 + value}px`;
  hungry.title = Math.floor(data.hunger);
  let hungry_shadow = document.querySelector('.hungry.shadow-status');
  hungry_shadow.title = Math.floor(data.hunger);

  let energy = document.querySelector('#energy');
  value = (Math.floor((((data.energy)*32)/100)));
  energy.style.height = value + 'px';
  energy.style.backgroundPositionY = `${-32 + value}px`;
  energy.title =  Math.floor(data.energy);
  let energy_shadow = document.querySelector('.energy.shadow-status');
  energy_shadow.title = Math.floor(data.energy);

  let joy = document.querySelector('#joy');
  let base_value = Math.ceil(data.joy/25)*25;
  value = (Math.floor(((data.joy*32)/base_value)-((base_value-data.joy)*((data.joy*32)/base_value)/25))) || 0;
  joy.style.height = value + 'px';
  joy.style.backgroundPositionY = `${-32 + value}px`;
  joy.title = Math.floor(data.joy);
  let joy_shadow = document.querySelector('.joy.shadow-status');
  joy_shadow.title = Math.floor(data.joy);

  let health = document.querySelector('#health');
  value = (Math.floor(((data.health*32)/100)));
  health.style.height = value + 'px';
  health.style.backgroundPositionY = `${-32 + value}px`;
  health.title = Math.floor(data.health);
  let health_shadow = document.querySelector('.health.shadow-status');
  health_shadow.title = Math.floor(data.health);

  let friendship = document.querySelector('#friendship');
  value = (Math.floor(((data.friendship*32)/100)));
  friendship.style.height = value + 'px';
  friendship.style.backgroundPositionY = `${-32 + value}px`;
  friendship.title = Math.floor(data.friendship);
  let friendship_shadow = document.querySelector('.friendship.shadow-status');
  friendship_shadow.title = Math.floor(data.friendship);

}

//todo procurar uma solucao melhor doque recalcular o bkg em toda mudanca.
function hapiness_analyze(data){
  let joy = document.querySelector('#joy.status');
  let joy_shadow = document.querySelector('.joy.status');
  if(data.joy > 75){
    joy.style.backgroundPosition = `-128px 0px`;
    joy_shadow.style.backgroundPosition = joy.style.backgroundPosition;
  }else if(data.joy > 50){
    joy.style.backgroundPosition = `-160px 0px`;
    joy_shadow.style.backgroundPosition = joy.style.backgroundPosition;
  }else if(data.joy > 25){
    joy.style.backgroundPosition = `-192px 0px`;
    joy_shadow.style.backgroundPosition = joy.style.backgroundPosition;
  }else{
    joy.style.backgroundPosition = `-224px 0px`;
    joy_shadow.style.backgroundPosition = joy.style.backgroundPosition;
  }
}

function lights_switch(){
  let digimon = party_config.findIndex(digimon => digimon.id == active_digimon);
  if(party_config[digimon].light){
    digivice_screen.style.filter = '';
  }else{
    digivice_screen.style.filter = 'brightness(30%)';
  }
}

function bkg_placer(){
  let digimon = party_config.findIndex(digimon => digimon.id == active_digimon);
  let wanted_bkg = `url("/resources/images/backgrounds/${party_config[digimon].bkg}.webp")`;
  if(digivice_screen.style.backgroundImage != wanted_bkg){
    digivice_screen.style.backgroundImage = wanted_bkg;
  }
}

document.querySelector('#pendulum-box').addEventListener('click', (e) => {
  if(e.target.classList.contains('digimon')){
    poop_clean_all();
    let screen = document.querySelector('#digivice.screen');
    swap_digimon(screen, e);
  }
});

//TODO rever a necessidade do uso excesivo da var data.

function poop_time(data){
  if(typeof poops[data.active_digimon] === 'undefined'){
    poops[data.active_digimon] = {};
  }
  let amount = data.poops - Object.keys(poops[data.active_digimon]).length;
  if(amount != 0){
    while(amount > 0){
      poops[data.active_digimon][Object.keys(poops[data.active_digimon]).length] = {
        x: Math.random() * 560 + 40,//digimon.offsetLeft + 96,
        y : 5,
      };
      amount--;
    }
  }
}

function poop_render(screen, data){
  let amount = Object.keys(poops[data.active_digimon]).length;
  if(amount > 0){
    for(const i in poops[data.active_digimon]){      
      let poop = document.querySelector(`#poop_${i}`);
      if(poop === null){
        let new_poop = document.createElement('div');
        new_poop.setAttribute('class', 'poop digivice-sprite');
        new_poop.style.bottom = `${poops[data.active_digimon][i].y}px`;
        new_poop.style.left = `${poops[data.active_digimon][i].x}px`;
        new_poop.textContent = i;
        new_poop.setAttribute('id', `poop_${i}`);
        if(typeof ANIMATION.stretch === 'undefined'){
          stretch(my_digimon, 1, 25);
        }
        screen.appendChild(new_poop);
        AUDIO.pooping.play();

        new_poop.addEventListener('click',(e) => {
          poop_remove(e, data);
        });
      }
    }
  }
}

function poop_remove(e, data){
  let poop = e.target;
  let poop_id = parseInt(e.target.textContent);
  poop.remove();

  delete poops[data.active_digimon][poop_id];
  socket.emit('poop_clean');
  AUDIO.poop_flush.play();
}

function poop_clean_all(){
  let spoops = document.querySelectorAll('.poop');
  for(const index in spoops){
    if(typeof spoops[index].classList !== 'undefined'){
      spoops[index].remove();
    }
  }
}

//======================================================
// Animations
//======================================================
let ANIMATION = {
  emotion: undefined,
  move_x: undefined,
  speak: undefined,
  stretch: undefined,
  swap_digimon: undefined,
};

//todo finalizar as expressoes, depois concluir salvamento e registro

function move_x(direction, digimon, frame_speed){
  if(ANIMATION.movement_x == undefined){
    let screen = document.querySelector('#digivice.screen');

  if(direction > 0 ){
    digimon.style.transform = 'scale(-1, 1)';
    digimon.firstElementChild.style.transform = 'scale(-1, 1)';
  }else{
    digimon.style.transform = 'scale(1, 1)';
    digimon.firstElementChild.style.transform = 'scale(1, 1)';
  }
  ANIMATION.movement_x = setInterval(frame, frame_speed);

  function frame(){
    let self_width = digimon.offsetWidth;
    if((digimon.offsetLeft >= (screen.offsetWidth - 10) - self_width && direction > 0) || (digimon.offsetLeft <=  0 && direction < 0)){
      digimon.offsetLeft <= 0 ? digimon.style.left = 0 + 'px' : digimon.style.left =  (screen.offsetWidth - self_width - 10) + 'px';
      clearInterval(ANIMATION.movement_x);
      ANIMATION.movement_x = undefined;
      digimon.offsetLeft <= 0 ? move_x(1, digimon, 2) : move_x(-1, digimon, 2);
    }else{
      digimon.style.left = (digimon.offsetLeft + direction) + 'px';
    }
  };
  }
}

function stretch(digimon, times, frame_speed){
  clearInterval(ANIMATION.stretch);
  let scale = {x:1, y:1};
  let flux = false;
  let cycle = 0;

  ANIMATION.stretch = setInterval(frame, frame_speed);

  function frame(){ 
    if(flux){
      scale.x -= 0.1;
      scale.y += 0.1;
    }else{
      scale.x += 0.1;
      scale.y -= 0.1;
    }

    if(scale.x <= 0.5){
      flux = false;
      cycle++;
    }else if(scale.x >= 1.5){
      flux = true
      cycle++;
    }

    if(cycle == (times*2) && scale.x == 1){
      clearInterval(ANIMATION.stretch);
      ANIMATION.stretch = undefined;
    }
    digimon.style.transform = `scale(${scale.x}, ${scale.y})`;
  }
}

function digimon_speak(data){
  if(typeof data.emotion !== 'undefined' && typeof ANIMATION.speak === 'undefined' && data.emotion != ''){
    let text_size = data.emotion.length;
    let read_time = ((text_size/ 40) + 1) * 1000;
    
    let src = my_digimon.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2');
    let digimon_img = new Image();
    digimon_img.src = src;
    let message = document.querySelector('#digimon-speak');

    message.style.width = `${(text_size * 9)/2}px`;
    message.style.height = `${Math.round(((text_size * 9)/2) * 2)}px`;

    message.style.bottom = `${(digimon_img.height / 6) + message.offsetHeight + 10}px`;
    message.textContent = data.emotion;
    message.style.display = 'flex';

    if(Math.round(Math.random()*100) < 1){
      message.classList.add('digicode');
    }else{
      message.classList.remove('digicode');
    }

    ANIMATION.speak = setTimeout(() => {
      message.style.display = 'none';
      clearTimeout(ANIMATION.speak);
      ANIMATION.speak = undefined;
    }, read_time);
  }
}

//todo checar se ha um modo de fazer a transicao entre digimons sem ter de por o io dentro do codigo da animacao
function swap_digimon(screen, e){
  screen.style.filter = 'brightness(0%)';
  if(typeof ANIMATION.swap_digimon === 'undefined'){
    ANIMATION.swap_digimon = setTimeout(() => {
      screen.style.filter = '';
      clearTimeout(ANIMATION.swap_digimon);
      ANIMATION.swap_digimon = undefined;
      socket.emit('pendulum_swap', {digimon_id: parseInt(e.target.textContent)});
    },1000);
  }
}

function stop_all_animation(){
  for(const index in ANIMATION){
    clearInterval(ANIMATION[index]);
    ANIMATION[index] = undefined;
  }
}

function stop_animation(animation){
  clearInterval(ANIMATION[animation]);
  ANIMATION[animation] = undefined;
}

function create_digimon_animation(){ 
  digimon_animation = {
    movement: my_digimon.animate(
      [{backgroundPositionX: '-288px'}], 
      {
        duration: 400,
        easing: 'steps(3)',
        iterations: Infinity,
    }),

    happy: my_digimon.animate(
      [{backgroundPositionX: '-192px'}], 
      {
        duration: 400,
        easing: 'steps(2)',
        iterations: Infinity,
    }),
  };
  digimon_animation.happy.pause();
}

function battle_animation(element){
  element.move = element.animate(
    [{backgroundPositionX: '-288px'}],
    {
      duration: 400,
      easing: 'steps(3)',
      iterations: Infinity,
    });

  element.selected = element.animate(
    [{filter: 'brightness(200%)'}],
    {
      duration: 1000,
      easing: 'steps(2)',
      iterations: Infinity,
    });

  element.faint = element.animate(
    [{filter: 'grayscale(0) blur(0px)', backgroundPosition: '0px -384px'},
     {filter: 'grayscale(100%) blur(0px)'},
     {filter: 'grayscale(100%) blur(30px)', backgroundPosition: '0px -384px'}],
     2000
  );

  element.attacked = element.animate(
    [{backgroundPosition: '0px -384px'}, 
     {backgroundPosition: '0px -384px'}],
     800
  );
  
  element.attacked.cancel();
  element.faint.cancel();
  element.selected.cancel();
}

create_digimon_animation();
//move_x(-1, digimon, 2);