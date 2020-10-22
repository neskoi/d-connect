module.exports = {
  'DA':{
    name: 'Dark Area',
    sweet_spot: (digimon) => {
      return 1;
    },
  },

  'UK':{
    name: 'Unknown',
    sweet_spot: (digimon) => {
      return 1;
    },
  },
  
  'DS':{
    name: 'Deep Savers',
    sweet_spot: (digimon) => {
      if(digimon.status.bond >= 700 && digimon.weight >= 200){
        return 0.8;
      }
      return 1;
    },
  },

  'DR':{
    name: "Dragon's Roar",
    sweet_spot: (digimon) => {
      if(digimon.weight >= 200 && digimon.status.hunger >= 800){
        return 0.8;
      }
      return 1;
    },
  },

  'JT':{
    name: 'Jungle Troopers',
    sweet_spot: (digimon) => {
      if(digimon.status.bond >= 700 && digimon.status.hunger >= 800){
        return 0.8;
      }
      return 1;
    },
  },

  'ME':{
    name: 'Metal Empire',
    sweet_spot: (digimon) => {
      if(digimon.status.energy >= 800 && digimon.status.health >= 800){
        return 0.8;
      }
      return 1;
    },
  },

  'NSp':{
    name: 'Nature Spirits',
    sweet_spot: (digimon) => {
      if(digimon.status.energy >= 800 && digimon.status.joy >= 800){
        return 0.8;
      }
      return 1;
    },
  },

  'NSo':{
    name: 'Nightmare Soldiers',
    sweet_spot: (digimon) => {
      if(digimon.status.joy <= 500 && digimon.status.health >= 600 && digimon.status.health <= 700){
        return 0.8;
      }
      return 1;
    },
  },

  'VB':{
    name: 'Virus Busters',
    sweet_spot: (digimon) => {
      if(digimon.status.bond >= 700 && digimon.status.health >= 800){
        return 0.8;
      }
      return 1;
    },
  },
  
  'WG':{
    name: 'Wind Guardians',
    sweet_spot: (digimon) => {
      if(digimon.weight <= 150 && digimon.status.energy > 700){
        return 0.8;
      }
      return 1;
    },
  },
}