module.exports = (sequelize, DataTypes) => {
  const Tamer_Monskin = sequelize.define('Tamer_Monskin', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_tamer_monskin_tamer:{type: DataTypes.INTEGER, unique: 'monskinConstraint', onDelete: 'CASCADE', references:{model: 'Tamer', key: 'id'}},
    fk_tamer_monskin_monskin:{type: DataTypes.INTEGER, unique: 'monskinConstraint', onDelete: 'CASCADE', references:{model: 'Monskin', key: 'id'}},

  },{timestamps: false});

  Tamer_Monskin.associate = function(models){
    Tamer_Monskin.belongsTo(models.Tamer, {foreignKey: 'fk_tamer_monskin_tamer', onDelete: 'cascade' });
    Tamer_Monskin.belongsTo(models.Monskin, {foreignKey: 'fk_tamer_monskin_monskin', onDelete: 'cascade' });
    Tamer_Monskin.hasOne(models.Tamermon,{foreignKey: 'fk_tamermon_tamer_monskin', onDelete: 'cascade' });
  }

  return Tamer_Monskin;
};