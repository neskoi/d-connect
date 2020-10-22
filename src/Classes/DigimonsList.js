//let {get_all_digimons} = require('../../repository/digimon');
let {get_all_digimons} = require('../../controllers/digimon');
const io = require('../io/io').io();

const DATA_LIFE_TIME =  600000; //Ten Minutes
const DIGIMONS_PER_PAGE = 36;

class DigimonsList{
  constructor(tamer_id){
    this.tamer_id = tamer_id;
    this.cache_time;
    this.data;
  }

  __still_valid(){
    let now =  new Date().getTime();
    return ((this.cache_time + DATA_LIFE_TIME >= now) && this.data);
  }

  async __update_digimons_list(){
    this.cache_time = new Date().getTime();
    let digimons = await get_all_digimons(this.tamer_id);
    return digimons;
  }

  async get_page(page = 1){
    if(!this.__still_valid()){
      this.data = await this.__update_digimons_list();
    }

    if(page > Object.keys(this.data).length){page = Object.keys(this.data).length};

    let selected_page = (page - 1) * DIGIMONS_PER_PAGE;
    let selected_digimons = page * DIGIMONS_PER_PAGE;
    let send_page = {
      digimons_per_page: DIGIMONS_PER_PAGE,
    }

    send_page.digimons_from_page = Object.values(this.data).slice(selected_page, selected_digimons);
    send_page.total_digimons = Object.keys(this.data).length;
    send_page.page_number = page;
    return send_page;
  }

  send_page(connection, page){
    io.to(connection).emit('digimons_list', page);
  }
}

function digimons_list_factory(tamer_id){
  let digimonslist = new DigimonsList(tamer_id);
  return digimonslist;
}

module.exports = (tamer_id) => {
  return digimons_list_factory(tamer_id);
}