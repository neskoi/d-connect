class Tamer{
  constructor(tamer_info){
    this.bit = tamer_info.bit;
    this.docoin = tamer_info.docoin;

    this.battles = tamer_info.battles;
    this.victories = tamer_info.victories;

    this.experience = tamer_info.experience;
    this.lvl = this.__level_formula();
    this.language = tamer_info.language;
    this.digimons_slots = tamer_info.digimons_slots;//?
  }

//adicionar sistema de titulos

  //todo checar a velocidade de evo
  __level_formula(){
    for (let lvl = 0; lvl <= 999; lvl++) {
      let lvl_exp = (25*(lvl*lvl*lvl))/2;
      if(lvl_exp >= this.experience){
        return lvl;
      }
    }
  }

  __has_bit(value){
    if(this.bit >= value){
      return true;
    }
    return false;
  }

  __has_docoin(value){
    if(this.docoin >= value){
      return true;
    }
    return false;
  }

  earn_bit(value){
    if(value > 0){
      this.bit += value;
    }
  }

  earn_docoin(value){
    if(value > 0){
      this.docoin += value;
    }
  }

  use_bit(value){
    if(!this.__has_bit){return}
    this.bit -= value;
  }

  use_docoin(value){
    if(!this.__has_docoin){return}
    this.docoin -= value;  
  }

  battle(){
    this.battles++;
  }

  win_battle(){
    this.victories++;
  }
  
  earn_exp(amount){
    if(amount > 0){
      this.experience += amount;
    }
  }

}

module.exports = (tamer_info) => {
  return new Tamer(tamer_info);
}