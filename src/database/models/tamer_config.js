'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tamer_Config = sequelize.define('Tamer_Config', {
    fk_tamer_config_tamer: {type: DataTypes.INTEGER, primaryKey: true, onDelete: 'CASCADE', references:{model: 'Tamer', key: 'id'}},
    fk_tamer_config_tamer_title: {allowNull: true, type: DataTypes.INTEGER, onDelete: 'CASCADE', references:{model: 'Tamer_Title', key: 'id'}},
    fk_tamer_config_tamer_skin: {allowNull: true, type: DataTypes.INTEGER, onDelete: 'CASCADE', references:{model: 'Tamer_Skin', key: 'id'}},
    party:{allowNull: false, type: DataTypes.STRING, defaultValue:'[]', validate:{notEmpty: true}},
    battles:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    victories:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    bit:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 1000},
    docoin:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 1000},
    experience:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 1},
    digimons_slots:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 5},
  },{timestamps: false});

  Tamer_Config.associate = function(models) {
    Tamer_Config.belongsTo(models.Tamer, {foreignKey: 'fk_tamer_config_tamer', onDelete: 'cascade' });
    Tamer_Config.belongsTo(models.Tamer_Title, {foreignKey: 'fk_tamer_config_tamer_title', onDelete: 'cascade' });
    Tamer_Config.belongsTo(models.Tamer_Skin, {foreignKey: 'fk_tamer_config_tamer_skin', onDelete: 'cascade' });
  };
  return Tamer_Config;
};