const database = require('../src/database/index');
const {Op} = require('sequelize');

const {Inventory} = database.models;

exports.add_item = async (tamer_id, item_id, quantity) => {
  let item = await Inventory.findOne({
    where:{
      [Op.and]:[{fk_inventory_tamer: tamer_id}, {fk_inventory_item: item_id}]
    }
  });

  if(item != null){
    Inventory.increment({quantity: quantity},{
      where:{
        [Op.and]:[{fk_inventory_tamer: tamer_id}, {fk_inventory_item: item_id}]
      }
    });
  }else{
    Inventory.create({
      fk_inventory_tamer: tamer_id,
      fk_inventory_item: item_id,
      quantity: quantity,
    });
  }
};