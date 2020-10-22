module.exports = (sequelize, DataTypes) => {
  const Background = sequelize.define('Background', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_background_field:{allowNull: false, type: DataTypes.INTEGER, onDelete: 'CASCADE', references:{model: 'Field', key: 'id'}},
    short_name:{allowNull: false, type: DataTypes.STRING(10), unique: true},
    name:{allowNull: false, type: DataTypes.STRING},
  },{timestamps: false});

  Background.associate = function(models){
    Background.belongsToMany(models.Tamer, {through: 'Tamer_Background', foreignKey: 'fk_tamer_background_background', onDelete: 'cascade' });
    Background.belongsTo(models.Field, {foreignKey: 'fk_background_field', onDelete: 'cascade' });
    Background.hasMany(models.Evochart, {foreignKey: 'fk_evochart_background', onDelete: 'cascade' });
  }

  return Background;
};