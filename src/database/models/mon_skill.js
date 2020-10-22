module.exports = (sequelize, DataTypes) => {
  const Mon_Skill = sequelize.define('Mon_Skill', {

    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_mon_skill_skill:{allowNull: false, type: DataTypes.INTEGER, primaryKey: true, references:{model: 'Skill', key: 'id'}},
    fk_mon_skill_mon:{allowNull: false, type: DataTypes.INTEGER, primaryKey: true, references:{model: 'Mon', key: 'id'}},
    min_lv:{allowNull: false, type: DataTypes.INTEGER}

  });

  return Mon_Skill;
};