module.exports =
{
  'Metal Cannon': {
    use: (caster, target) => {
      let damage = 30;
      caster.stats.sp -= 20;
      target.stats.hp -= damage;
      return {damage, inflict:[]};
    },
    cost: 20,
    is_sp: true,
    description_en: 'Metal Balls from your mouth. NICENICENICE',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

  'V-mon Head': {
    use: (caster, target) => {
      let damage =  2500;
      caster.stats.sp -= 15;
      target.hp_decrease(damage);
      return {damage, inflict:[]};
    },
    cost: 15,
    is_sp: true,
    description_en: 'Its not a hammer, its a Headmmer',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

  'SAMPLE': {
    use: (caster, target) => {
      //Do stuff here
      return {damage, inflict:[]};
    },
    cost: 0,
    is_sp: true,
    description_en: '',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

}

 
  
