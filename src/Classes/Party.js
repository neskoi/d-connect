class Party{
  constructor(digimons, party_config){
    this.digimons = digimons;
    this.bkg = [];
    this.configuration = [];
    this.__party_configurantion_loader(party_config);
    this.observers = [];
  }
  
  subscribe(fn){
    this.observers.push(fn);
  }

  unsubscribe(fn){
   let unsub = this.observers.findIndex(remove_fn => remove_fn === fn);
   this.observers.splice(unsub, 1);
  }

  notify(){
    this.observers.forEach(fn => fn.call());
  }

  __party_configurantion_loader(party_config){
    this.configuration = JSON.parse(party_config);
    if(this.configuration.length == 0 ){
      for(const digimon in this.digimons){
        this.configuration.push({id:this.digimons[digimon].id, bkg:'DFLT', light: true});
      }
    }
  }

  __has_space(){
    return this.configuration.length <= 3;
  }

  __left_one(){
    return this.configuration.length > 1;
  }

  __is_active(digimon_id, active_id){
    return digimon_id != active_id;
  }

  __is_on_party(digimon_id){
    return this.configuration.some(digimon => digimon.id == digimon_id);
  }

  __save_party(){
    //save?
  }

  add_digimon(digimon){
    if(!this.__is_on_party(digimon.id) && this.__has_space){
      this.configuration.push({id:digimon.id, bkg:'DFLT', light: true});
      this.digimons[digimon.id] = digimon;
      this.notify();
    }
  }

  remove_digimon(digimon_id, active_id){
    if(this.__is_on_party(digimon_id) && this.__is_active(digimon_id, active_id) && this.__left_one()){
      let remove_digimon = this.configuration.findIndex(digimon => digimon.id == digimon_id);
      this.configuration.splice(remove_digimon, 1);
      delete this.digimons[digimon_id];
      this.notify();
    }
  }

  swap_digimon(old_id, new_digimon){
    if(this.__is_on_party(old_id)){
      let remove_id = this.configuration.findIndex(digimon => digimon.id == old_id);
      this.configuration[remove_id].id = new_digimon.id;
      this.digimons[new_digimon.id] = new_digimon;
      delete this.digimons[old_id];
      this.notify();
    }
  }

  swap_digimon_inside_party(old_digimon_id, new_digimon_id){
    if(this.__is_on_party(old_digimon_id)){
      if(this.__is_on_party(new_digimon_id)){
        console.log('swap inside party');
        let old_id = this.configuration.findIndex(id=> id.id == old_digimon_id);
        let new_id = this.configuration.findIndex(id=> id.id == new_digimon_id);
        console.log(this.configuration);
        [this.configuration[old_id], this.configuration[new_id]] = [this.configuration[new_id], this.configuration[old_id]];
        this.notify();
      }
    }
  }
  
  __has_background(bkg){
    return this.backgrounds.some(element => element.short_name == bkg);
  }

  swap_digimon_bkg(digimon, new_bkg){
    if(!this.__has_background(new_bkg)) return;

    let index = this.configuration.findIndex(index => index.id == digimon);
    this.configuration[index].bkg = new_bkg;
    this.notify();
  }

  lights_switch(digimon){
    let index = this.configuration.findIndex(index => index.id == digimon);
    this.configuration[index].light = !this.configuration[index].light;
    this.notify();
  }
}

module.exports = (digimons, party_config) => {
  return new Party(digimons, party_config);;
}