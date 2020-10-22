module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {

    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_item_category:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references:{model: 'Category', key: 'id'}},
    name:{allowNull: false, type: DataTypes.STRING(20), unique: true, validate:{isEmpty: true}},    
    max_stack:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 1}

  }, {timestamps: false});

  Item.associate = function(models){
    Item.belongsTo(models.Category, {foreignKey: 'fk_item_category'});
    Item.belongsToMany(models.Tamer, {through: 'Inventory', foreignKey: 'fk_inventory_item', onDelete: 'cascade' });
    Item.belongsToMany(models.Mon, {through: 'Drop', foreignKey: 'fk_drop_item', onDelete: 'cascade' });
  }

  return Item;
};