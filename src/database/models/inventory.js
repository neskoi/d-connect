module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {

    fk_inventory_tamer:{type: DataTypes.INTEGER, primaryKey: true, onDelete: 'CASCADE', references:{model: 'Tamer', key: 'id'}},
    fk_inventory_item:{type: DataTypes.INTEGER, primaryKey: true, onDelete: 'CASCADE', references:{model: 'Item', key: 'id'}},
    quantity:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0}

  });

  Inventory.associate = function(models){
    Inventory.belongsToMany(models.Tamer, {through: 'Inventory', foreignKey: 'fk_inventory_item', onDelete: 'cascade' });
    Inventory.belongsTo(models.Item, {foreignKey: 'fk_inventory_item', onDelete: 'cascade' });
  }

  return Inventory;
};