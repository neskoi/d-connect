const tamer_controller = require('../controllers/tamer');
const tamer_repo = require('../repository/tamer');

const Party = require('../src/Classes/Party');
const Tamer = require('../src/Classes/Tamer');

const Inventory = require('../src/Classes/Inventory');
const Pendulum = require('../src/Classes/Pendulum');
const {get_digimons} = require('../controllers/digimon');

module.exports = async function (tamer) {
  TAMER_LIST[tamer.login] = {};
  let tamer_info =  await tamer_controller.info_load(tamer.id);
      tamer_info.language = tamer.fk_tamer_language;

  let digimons = await get_digimons(tamer.id, 1);

  TAMER_LIST[tamer.login].tamer = Tamer(tamer_info);
  TAMER_LIST[tamer.login].party = Party(digimons, tamer_info.party);
  TAMER_LIST[tamer.login].party.bkg = await tamer_repo.bkgs_load(tamer.id);
  
  console.log(TAMER_LIST[tamer.login].party.bkg);

  TAMER_LIST[tamer.login].inventory = await Inventory(tamer.id);
  TAMER_LIST[tamer.login].pendulum = Pendulum(TAMER_LIST[tamer.login].party);

  TAMER_LIST[tamer.login].in_battle = false;
  TAMER_LIST[tamer.login].cache_time = new Date().getTime(); 
}

