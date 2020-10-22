module.exports =
{

//========================================================
// Disk
//========================================================

  'HP Disk': {
    use: (target) => {
      target.hp_increase(100);
      return {value: 100, inflict:['heal']}
    },
    description_en: 'Heals yours HP in 100.',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

  'SP Disk': {
    use: (target) => {
      target.sp_increase(100);
    },
    description_en: 'Restore your SP by 100.',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

  'HSP Disk': {
    use: (target) => {
      target.hp_increase(100);
      target.sp_increase(100);
    },
    description_en: 'Restore your HP and SP by 100.',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

  'Small Meat': {
    use: (target) => {
      target.status_increase('hunger',200);
    },
    description_en: 'Can feed a small digimon.',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

  'Medium Meat': {
    use: (target) => {
      target.status_increase('hunger',500);
    },
    description_en: 'Can feed a medium digimon.',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

  'Big Meat': {
    use: (target) => {
      target.status_increase('hunger',800)
    },
    description_en: 'Can feed a big digimon.',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

  'Medicine': {
    use: (target) => {
      target.is_sick = false;
    },
    description_en: 'It can cure a digimon sickness.',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

  

  'SAMPLE': {
    use: (target) => {
      //Do stuff here
    },
    description_en: '',
    description_jp: '',
    description_sp: '',
    description_pt: '',
  },

}

 
  
