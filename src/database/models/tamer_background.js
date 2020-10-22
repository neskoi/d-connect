module.exports = (sequelize, DataTypes) => {
  const Tamer_Background = sequelize.define('Tamer_Background', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_tamer_background_tamer:{type: DataTypes.INTEGER, unique: 'backgroundConstraint', onDelete: 'CASCADE', references:{model: 'Tamer', key: 'id'}},
    fk_tamer_background_background:{type: DataTypes.INTEGER, unique: 'backgroundConstraint', onDelete: 'CASCADE', references:{model: 'Background', key: 'id'}},

  },{timestamps: false});

  Tamer_Background.associate = function(models){
    Tamer_Background.belongsTo(models.Tamer, {foreignKey: 'fk_tamer_background_tamer', onDelete: 'cascade' });
    Tamer_Background.belongsTo(models.Background, {foreignKey: 'fk_tamer_background_background', onDelete: 'cascade' });
  }

  return Tamer_Background;
};