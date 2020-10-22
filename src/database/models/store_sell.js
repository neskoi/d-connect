module.exports = (sequelize, DataTypes) => {
  const Store_Sell = sequelize.define('Store_Sell', {

    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_store_sell_tamer:{allowNull: false, type: DataTypes.INTEGER, references:{model: 'Tamer', key: 'id'}},
    fk_store_sell_item:{allowNull: false, type: DataTypes.INTEGER, references:{model: 'Item', key: 'id'}},
    fk_store_sell_coupon:{type: DataTypes.INTEGER, references:{model: 'Coupon', key: 'id'}},
    quantity:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 1},
    total_value:{allowNull: false, type: DataTypes.INTEGER}
    
  }, {updatedAt: false});

  Store_Sell.associate = function(models){
    Store_Sell.belongsTo(models.Coupon, {foreignKey: 'fk_store_sell_coupons', onDelete: 'cascade' });
    Store_Sell.belongsTo(models.Coupon, {foreignKey: 'fk_store_sell_tamer', onDelete: 'cascade' });
    Store_Sell.belongsTo(models.Coupon, {foreignKey: 'fk_store_sell_item', onDelete: 'cascade' });
  }
  // to do
    //adicionar outra tabela para pode comprar mais de um item por vez

  return Store_Sell;
};