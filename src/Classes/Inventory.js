const database = require('../database/index');
const {Op} = require('sequelize');
const {Category, Inventory, Item} = database.models;
const ITEM = require('./items');

class Tamer_Inventory{
  constructor(items){
    this.items = items;
  }

  for_battle(item_name){
    if(this.items[item_name].category == 'Disk'){
      return true;
    }
    return false;
  }

  has_item(item_name){
    if(this.items[item_name]){
      return true;
    }
    return false;
  } 

  use_item(item_name, target){
    return ITEM[item_name].use(target);
  }

  add_item(item_id, amount){
    this.items[item_id].quantity += amount;
  }

  remove_item(item_id, amount){
    this.items[item_id].quantity -= amount;
    if(this.items[item_id].quantity == 0){
      delete this.items[item_id];
    }
  }

  description_attacher(language){
    let attached = JSON.parse(JSON.stringify(this.items));
    for(const index in attached){
      if(!ITEM[index]) continue;
      attached[index].description = ITEM[index][`description_${language}`];
    }
    return attached;
  }
}

async function load_items(tamer_id){
  let raw_items = await Inventory.findAll({
    raw: true,
    attributes: ['fk_inventory_item', 'quantity'],
    where:{
      [Op.and]:[
        {fk_inventory_tamer: tamer_id},
        {quantity:{[Op.gt]:0}}
      ]},
      include:[{model: Item, attributes: ['name'], include:[{model: Category, attributes: ['name']}]}]
  }).catch(err => console.log(err));

  let items = {};
  //Filtering and organaizing elements of items.
  for(const index in raw_items){
    items[raw_items[index]['Item.name']] = ({
      category:raw_items[index]['Item.Category.name'],
      quantity: raw_items[index].quantity});
  }
  return items;
}

async function inventory_factory(tamer_id){
  items = await load_items(tamer_id);
  let inventory = new Tamer_Inventory(items);
  return inventory;
}

module.exports = (tamer_id)=>{
  let inventory =  inventory_factory(tamer_id);
  return inventory;
}