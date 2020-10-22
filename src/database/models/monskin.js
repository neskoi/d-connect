module.exports = (sequelize, DataTypes) => {
  const Monskin = sequelize.define('Monskin', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_monskin_mon:{type: DataTypes.INTEGER, onDelete: 'CASCADE', references:{model: 'Mon', key: 'id'}},
    short_name:{allowNull: false, type: DataTypes.STRING(10), unique: true},
    name:{allowNull: false, type: DataTypes.STRING},
  },{timestamps: false});

  Monskin.associate = function(models){
    Monskin.belongsToMany(models.Tamer, {through: 'Tamer_Monskin', foreignKey: 'fk_tamer_monskin_monskin', onDelete: 'cascade' });
    Monskin.belongsTo(models.Mon, {foreignKey: 'fk_monskin_mon', onDelete: 'cascade' });
  }

  return Monskin;
};