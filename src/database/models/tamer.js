'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tamer = sequelize.define('Tamer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_tamer_language:{allowNull: false, type: DataTypes.STRING(2), onDelete: 'CASCADE', references: {model: 'Language', key: 'language'}},
    firstname:{allowNull: false, type: DataTypes.STRING(45), validate:{notEmpty: true}},
    lastname:{allowNull: false, type: DataTypes.STRING(45), validate:{notEmpty: true}},
    gender:{allowNull: false, type: DataTypes.STRING(2), validate:{notEmpty: true}},
    born_date:{allowNull: false, type: DataTypes.DATEONLY, validate:{isDate: true}},
    login:{allowNull: false, type: DataTypes.STRING(20), unique: true, validate:{notEmpty: true}},
    email:{allowNull: false, type: DataTypes.STRING, unique: true, validate:{notEmpty: true, isEmail: true}},
    pw:{allowNull: false, type: DataTypes.STRING(60), validate:{notEmpty: true}},
    active:{allowNull: false, type: DataTypes.BOOLEAN, defaultValue: 0},
    banned:{allowNull: false, type: DataTypes.BOOLEAN, defaultValue: 0}
  },{
      hooks: {
        afterCreate: function(tamer, options) {
          sequelize.models.Tamer_Config.create({
            fk_tamer_config_tamer: tamer.id
          });

          sequelize.models.Tamermon.create({
            fk_tamermon_tamer: tamer.id,
            fk_tamermon_mon: 1,
            fk_tamermon_personality: 1,
            fk_tamermon_place: 1,
            natural_atk: 5,
            natural_def: 5,
            natural_con: 5,
            natural_int: 5,
            natural_tec: 5,
            natural_spd: 5,
          });

          sequelize.models.Inventory.bulkCreate(
            {//Meat
              fk_inventory_tamer: tamer.id,
              fk_inventory_item: 1,
              quantity: 5,           
            },
           /*  {//Medicine
              fk_inventory_tamer: tamer.id,
              fk_inventory_item: 1,
              quantity: 1,           
            },
            {//HP Disk
              fk_inventory_tamer: tamer.id,
              fk_inventory_item: 1,
              quantity: 3,           
            } */
          );
        }
      }
    },
  );

  Tamer.associate = function(models) {
    Tamer.hasOne(models.Tamer_Config, {foreignKey: 'fk_tamer_config_tamer', onDelete: 'cascade' });
    Tamer.hasMany(models.Log_in, {foreignKey: 'fk_log_in_tamer', onDelete: 'cascade' });
    Tamer.belongsTo(models.Language, {foreignKey: 'fk_tamer_language', onDelete: 'cascade' });
    Tamer.belongsToMany(models.Item, {through: 'Inventory', foreignKey: 'fk_inventory_tamer', onDelete: 'cascade' });
    Tamer.belongsToMany(models.Mon, {through: 'Tamermon', foreignKey: 'fk_tamermon_tamer', onDelete: 'cascade' });
    Tamer.belongsToMany(models.Title, {through: 'Tamer_Title', foreignKey: 'fk_tamer_title_tamer', onDelete: 'cascade' });
    Tamer.belongsToMany(models.Skin, {through: 'Tamer_Skin', foreignKey: 'fk_tamer_skin_tamer', onDelete: 'cascade' });
  };

  return Tamer;
};