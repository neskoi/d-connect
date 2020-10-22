module.exports = (sequelize, DataTypes) => {
  const Mon = sequelize.define('Mon', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    specie:{allowNull: false, type: DataTypes.STRING(50), unique: true, validate:{isAlpha: true}},
    fk_mon_evostage:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references:{model: 'Evostage', key: 'id'}},
    fk_mon_attribute:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references:{model:'Attribute', key: 'id'}},
    fk_mon_element:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references:{model: 'Element', key: 'id'}},
    fk_mon_field:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references:{model: 'Field', key: 'id'}},
    base_con:{allowNull: false, type: DataTypes.INTEGER, validate:{isEmpty: true}},
    base_int:{allowNull: false, type: DataTypes.INTEGER, validate:{isEmpty: true}},
    base_atk:{allowNull: false, type: DataTypes.INTEGER, validate:{isEmpty: true}},
    base_def:{allowNull: false, type: DataTypes.INTEGER, validate:{isEmpty: true}},
    base_tec:{allowNull: false, type: DataTypes.INTEGER, validate:{isEmpty: true}},
    base_spd:{allowNull: false, type: DataTypes.INTEGER, validate:{isEmpty: true}},
  },{timestamps: false});

  Mon.associate = function(models) {
    Mon.belongsTo(models.Evostage, {foreignKey: 'fk_mon_evostage', onDelete: 'cascade' });
    Mon.belongsTo(models.Attribute, {foreignKey: 'fk_mon_attribute', onDelete: 'cascade' });
    Mon.belongsTo(models.Element, {foreignKey: 'fk_mon_element', onDelete: 'cascade' });
    Mon.belongsTo(models.Field, {foreignKey: 'fk_mon_field', onDelete: 'cascade' });
    Mon.belongsToMany(models.Tamer, {through: 'Tamermon', foreignKey: 'fk_tamermon_mon', onDelete: 'cascade' });
    Mon.belongsToMany(models.Skill, {through: 'Mon_Skill', foreignKey: 'fk_mon_skill_mon', onDelete: 'cascade' });
    Mon.belongsToMany(models.Item, {through: 'Drop', foreignKey: 'fk_drop_mon', onDelete: 'cascade' });
    Mon.hasMany(models.Evochart, {foreignKey: 'fk_evochart_mon_acestor', onDelete: 'cascade' });
    Mon.hasMany(models.Evochart, {foreignKey: 'fk_evochart_mon_descendant', onDelete: 'cascade' });
    Mon.hasMany(models.Tamermon, {foreignKey: 'fk_tamermon_mon', onDelete: 'cascade' });
    Mon.hasMany(models.Monskin, {foreignKey: 'fk_monskin_mon', onDelete: 'cascade' });
  };

  return Mon;
};