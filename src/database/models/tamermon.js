module.exports = (sequelize, DataTypes) =>{
  const Tamermon = sequelize.define('Tamermon',{

    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_tamermon_tamer:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references: {model: 'Tamer', key: 'id'}},
    fk_tamermon_mon:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references: {model: 'Mon', key: 'id'}},
    fk_tamermon_personality:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references: {model: 'Personality', key: 'id'}},
    fk_tamermon_place:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references: {model: 'Place', key: 'id'}},
    fk_tamermon_tamer_monskin:{allowNull: true, type: DataTypes.INTEGER, onDelete: 'CASCADE', references: {model: 'Tamer_Monskin', key: 'id'}},
    nickname:{allowNull: false, type: DataTypes.STRING(10),  defaultValue: 'Digimon', validate:{notEmpty: true}},
    experience:{type: DataTypes.INTEGER, defaultValue: 1},
    bond:{type: DataTypes.INTEGER, defaultValue: 100},
    hunger:{type: DataTypes.INTEGER, defaultValue: 1000},
    energy:{type: DataTypes.INTEGER, defaultValue: 1000},
    joy:{type: DataTypes.INTEGER, defaultValue: 740},
    health:{type: DataTypes.INTEGER, defaultValue: 1000},
    is_sick:{allowNull: false, type: DataTypes.BOOLEAN, defaultValue: 0},
    weight:{type: DataTypes.INTEGER, defaultValue: 5},
    poops:{type: DataTypes.INTEGER, defaultValue: 0},
    trait:{type: DataTypes.INTEGER, defaultValue: 0},
    train_times:{type: DataTypes.INTEGER, defaultValue: 0},
    battles:{type: DataTypes.INTEGER, defaultValue: 0},
    victories:{type: DataTypes.INTEGER, defaultValue: 0},
    alter_color:{type: DataTypes.INTEGER, defaultValue: 0},
    natural_con:{type: DataTypes.INTEGER, defaultValue: 0},
    natural_int:{type: DataTypes.INTEGER, defaultValue: 0},
    natural_atk:{type: DataTypes.INTEGER, defaultValue: 0},
    natural_def:{type: DataTypes.INTEGER, defaultValue: 0},
    natural_tec:{type: DataTypes.INTEGER, defaultValue: 0},
    natural_spd:{type: DataTypes.INTEGER, defaultValue: 0},
    train_con:{type: DataTypes.INTEGER, defaultValue: 0},
    train_int:{type: DataTypes.INTEGER, defaultValue: 0},
    train_atk:{type: DataTypes.INTEGER, defaultValue: 0},
    train_def:{type: DataTypes.INTEGER, defaultValue: 0},
    train_tec:{type: DataTypes.INTEGER, defaultValue: 0},
    train_spd:{type: DataTypes.INTEGER, defaultValue: 0}
  },{});

  Tamermon.associate = function (models){
    Tamermon.belongsTo(models.Personality, {foreignKey: 'fk_tamermon_personality', onDelete: 'cascade' });
    Tamermon.belongsTo(models.Mon, {foreignKey: 'fk_tamermon_mon', onDelete: 'cascade' });
    Tamermon.belongsTo(models.Place, {foreignKey: 'fk_tamermon_place', onDelete: 'cascade' });
    Tamermon.belongsTo(models.Tamer, {foreignKey: 'fk_tamermon_tamer', onDelete: 'cascade' });
    Tamermon.belongsTo(models.Tamer_Monskin, {foreignKey: 'fk_tamermon_tamer_monskin', onDelete: 'cascade' });
    Tamermon.belongsToMany(models.Skill, {through: 'Tamermon_Skill', foreignKey: 'fk_tamermon_skill_tamermon', onDelete: 'cascade' });
  };

  return Tamermon;
};