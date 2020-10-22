module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill',{
    
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{allowNull: false, type: DataTypes.STRING(20), unique: true, validate:{isEmpty: true}},
    fk_skill_element:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references: {model: 'Element', key: 'id'}},

  }, {timestamps: false});

  Skill.associate = (models) => {
    Skill.belongsTo(models.Element, {foreignKey: 'fk_skill_element', onDelete: 'cascade' });
    Skill.belongsToMany(models.Tamermon, {through: 'Tamermon_Skill', foreignKey: 'fk_tamermon_skill_skill', onDelete: 'cascade' });
    Skill.belongsToMany(models.Mon, {through: 'Mon_Skill', foreignKey: 'fk_mon_skill_skill', onDelete: 'cascade' });
  };

  return Skill;
}