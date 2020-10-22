module.exports = (sequelize, DataTypes) => {
  const Tamer_Skin = sequelize.define('Tamer_Skin', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_tamer_skin_tamer:{type: DataTypes.INTEGER, unique: 'skinConstraint', onDelete: 'CASCADE', references:{model: 'Tamer', key: 'id'}},
    fk_tamer_skin_skin:{type: DataTypes.INTEGER, unique: 'skinConstraint', onDelete: 'CASCADE', references:{model: 'Skin', key: 'id'}},

  },{timestamps: false});

  Tamer_Skin.associate = function(models){
    Tamer_Skin.belongsTo(models.Tamer, {foreignKey: 'fk_tamer_skin_tamer', onDelete: 'cascade' });
    Tamer_Skin.belongsTo(models.Skin, {foreignKey: 'fk_tamer_skin_skin', onDelete: 'cascade' });
    Tamer_Skin.hasMany(models.Tamer_Config,{foreignKey: 'fk_tamer_config_tamer_skin', onDelete: 'cascade' });
  }

  return Tamer_Skin;
};