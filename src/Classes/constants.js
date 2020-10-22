let text = 'Oi casada';

const CONSTANTS = {

  ATTRIBUTE : {
    Data:{
      Data: 1,
      Free: 1,
      Vaccine: 1.2,
      Virus: 0.8
    },
    Free:{
      Data: 1,
      Free: 1,
      Vaccine: 1,
      Virus: 1
    },
    Vaccine:{
      Data: 0.8,
      Free: 1,
      Vaccine: 1,
      Virus: 1.2
    },
    Virus:{
      Data: 1.2,
      Free: 1,
      Vaccine: 0.8,
      Virus: 1
    }
  },

  ELEMENT : {
    Dark:{
      Dark: 1,
      Earth: 1,
      Eletric: 1.2,
      Fire: 1,
      Ice: 1,
      Light: 0.8,
      Metal: 1,
      Plant: 1,
      Water: 1,
      Wind: 1,
      Neutral: 1
    },
    Earth:{
      Dark: 1,
      Earth: 1,
      Eletric: 1,
      Fire: 1,
      Ice: 1,
      Light: 1,
      Metal: 1,
      Plant: 0.8,
      Water: 1,
      Wind: 1.2,
      Neutral: 1
    },
    Eletric:{
      Dark: 0.8,
      Earth: 1,
      Eletric: 1,
      Fire: 1,
      Ice: 1,
      Light: 1,
      Metal: 1.2,
      Plant: 1,
      Water: 1,
      Wind: 1,
      Neutral: 1
    },
    Fire:{
      Dark: 1,
      Earth: 1,
      Eletric: 1,
      Fire: 1.2,
      Ice: 1,
      Light: 1,
      Metal: 1,
      Plant: 1,
      Water: 0.8,
      Wind: 1,
      Neutral: 1
    },
    Ice:{
      Dark: 1,
      Earth: 1,
      Eletric: 1,
      Fire: 0.8,
      Ice: 1,
      Light: 1,
      Metal: 1,
      Plant: 1,
      Water: 1.2,
      Wind: 1,
      Neutral: 1
    },
    Light:{
      Dark: 1.2,
      Earth: 1,
      Eletric: 1,
      Fire: 1,
      Ice: 1,
      Light: 1,
      Metal: 0.8,
      Plant: 1,
      Water: 1,
      Wind: 1,
      Neutral: 1
    },
    Metal:{
      Dark: 1,
      Earth: 1,
      Eletric: 0.8,
      Fire: 1,
      Ice: 1,
      Light: 1.2,
      Metal: 1,
      Plant: 1,
      Water: 1,
      Wind: 1,
      Neutral: 1
    },
    Plant:{ 
      Dark: 1,
      Earth: 1.2,
      Eletric: 1,
      Fire: 1,
      Ice: 1,
      Light: 1,
      Metal: 1,
      Plant: 1,
      Water: 1,
      Wind: 0.8,
      Neutral: 1
  },
    Water:{
      Dark: 1,
      Earth: 1,
      Eletric: 1,
      Fire: 1.2,
      Ice: 0.8,
      Light: 1,
      Metal: 1,
      Plant: 1,
      Water: 1,
      Wind: 1,
      Neutral: 1
    },
    Wind:{
      Dark: 1,
      Earth: 0.8,
      Eletric: 1,
      Fire: 1,
      Ice: 1,
      Light: 1,
      Metal: 1,
      Plant: 1.2,
      Water: 1,
      Wind: 1,
      Neutral: 1
    },
    Neutral:{
      Dark: 1,
      Earth: 1,
      Eletric: 1,
      Fire: 1,
      Ice: 1,
      Light: 1,
      Metal: 1,
      Plant: 1,
      Water: 1,
      Wind: 1,
      Neutral: 1
    }
  },

  FIELD:{
/*  'DA':{
      name: 'Dark Area',
    }, */
/*  'UK':{
      name: 'Unknown',
    }, */

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
  },

  PERSONALITY : {
    Brave:{
      atk: 1,
      def: 1,
      con: 1,
      int: 1,
      tec: 1,
      spd: 1,
      hungry_rate: 1,
      energy_rate: 1,
      joy_rate: 1,

      phrases:{
        probability: 100,
        hunger:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        energy:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        joy:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        health:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        bond:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        trait:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
      },
    },

    Energic:{
      atk: 1,
      def: 1,
      con: 1,
      int: 1,
      tec: 1,
      spd: 1,
      hungry_rate: 1,
      energy_rate: 1,
      joy_rate: 1,

      phrases:{
        probability: 100,
        hunger:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        energy:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        joy:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        health:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        bond:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        trait:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
      },
    },

    Gracefull:{
      atk: 1,
      def: 1,
      con: 1,
      int: 1,
      tec: 1,
      spd: 1,
      hungry_rate: 1,
      energy_rate: 1,
      joy_rate: 1,

      phrases:{
        probability: 100,
        hunger:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        energy:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        joy:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        health:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        bond:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        trait:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
      },
    },

    Lazy:{
      atk: 1,
      def: 1,
      con: 1,
      int: 1,
      tec: 1,
      spd: 1,
      hungry_rate: 1,
      energy_rate: 1,
      joy_rate: 1,

      phrases:{
        probability: 100,
        hunger:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        energy:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        joy:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        health:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        bond:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        trait:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
      },
    },

    Timid:{
      atk: 1,
      def: 1,
      con: 1,
      int: 1,
      tec: 1,
      spd: 1,
      hungry_rate: 1,
      energy_rate: 1,
      joy_rate: 1,

      phrases:{
        probability: 100,
        hunger:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        energy:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        joy:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        health:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        bond:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
        trait:{
          0:text,
          1:text,
          2:text,
          3:text,
          4:text,
        },
      },
    },

    _sample:{
      atk: 1,
      def: 1,
      con: 1,
      int: 1,
      tec: 1,
      spd: 1,
      hungry_rate: 1,
      energy_rate: 1,
      joy_rate: 1,

      phrases:{
        probability: 100,
        hunger:{
          0:'',
          1:'',
          2:'',
          3:'',
          4:'',
        },
        energy:{
          0:'',
          1:'',
          2:'',
          3:'',
          4:'',
        },
        joy:{
          0:'',
          1:'',
          2:'',
          3:'',
          4:'',
        },
        health:{
          0:'',
          1:'',
          2:'',
          3:'',
          4:'',
        },
        bond:{
          0:'',
          1:'',
          2:'',
          3:'',
          4:'',
        },
        trait:{
          0:'',
          1:'',
          2:'',
          3:'',
          4:'',
        },
      },
    },
  },

}

module.exports = CONSTANTS;