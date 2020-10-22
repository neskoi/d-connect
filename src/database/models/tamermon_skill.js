module.exports = (sequelize, DataTypes) => {
  const Tamermon_Skill = sequelize.define('Tamermon_Skill', {
    
    fk_tamermon_skill_tamermon:{allowNull: false, type: DataTypes.INTEGER, primaryKey: true, references:{model: 'Tamermon', key: 'id'}},
    fk_tamermon_skill_skill:{allowNull: false, type: DataTypes.INTEGER, primaryKey: true, references:{model: 'Skill', key: 'id'}},
    active:{allowNull: false, type: DataTypes.BOOLEAN, defaultValue: 0},

  });

  Tamermon_Skill.associate = (models) => {
   
    Tamermon_Skill.belongsTo(models.Skill, {foreignKey: 'fk_tamermon_skill_skill', onDelete: 'cascade' });
    Tamermon_Skill.belongsTo(models.Tamermon, {foreignKey: 'fk_tamermon_skill_tamermon', onDelete: 'cascade' });
  };

  return Tamermon_Skill;
};