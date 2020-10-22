module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {

    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    coupon:{allowNull: false, type: DataTypes.STRING(20), unique: true, validate:{isEmpty: true}},
    max_usage:{allowNull: false, type: DataTypes.INTEGER},
    used_times:{allowNull: false, type: DataTypes.INTEGER}
    
  });

  Coupon.associate = function(models){
    Coupon.hasMany(models.Store_Sell, {foreignKey: 'fk_store_sell_coupons', onDelete: 'cascade' });
  }

  return Coupon;
};