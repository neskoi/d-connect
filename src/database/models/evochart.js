module.exports = (sequelize, DataTypes) => {
  const Evochart = sequelize.define('Evochart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_evochart_mon_ancestor:{type: DataTypes.INTEGER, primaryKey: true, references:{model: 'Mon', key: 'id'}},
    fk_evochart_mon_descendant:{type: DataTypes.INTEGER, primaryKey: true, references:{model: 'Mon', key: 'id'}},
    fk_evochart_background:{allowNull: true, type: DataTypes.INTEGER, primaryKey: true, references:{model: 'Background', key: 'id'}},
    require_field:{allowNull: false, type: DataTypes.BOOLEAN, defaultValue: 0},
    bond:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    hunger:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    energy:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    joy:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    health:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    weight:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    trait:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    train_times:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    battles:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    victories:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 0},
    required_con:{allowNull: false, type: DataTypes.INTEGER},
    required_int:{allowNull: false, type: DataTypes.INTEGER},
    required_atk:{allowNull: false, type: DataTypes.INTEGER},
    required_def:{allowNull: false, type: DataTypes.INTEGER},
    required_tec:{allowNull: false, type: DataTypes.INTEGER},
    required_spd:{allowNull: false, type: DataTypes.INTEGER},

  }, {timestamps: false});

  Evochart.associate = function(models){
    Evochart.belongsTo(models.Mon, {foreignKey: 'fk_evochart_mon_acestor', onDelete: 'cascade' });
    Evochart.belongsTo(models.Mon, {foreignKey: 'fk_evochart_mon_descendant', onDelete: 'cascade' });
    Evochart.belongsTo(models.Background, {foreignKey: 'fk_evochart_background', onDelete: 'cascade' });
  };

  return Evochart;
};