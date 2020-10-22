module.exports = (sequelize, DataTypes) => {
  const Skin = sequelize.define('Skin', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    short_name:{allowNull: false, type: DataTypes.STRING(10), unique: true},
    name:{allowNull: false, type: DataTypes.STRING},
  },{timestamps: false});

  Skin.associate = function(models){
    Skin.belongsToMany(models.Tamer, {through: 'Tamer_Skin', foreignKey: 'fk_tamer_skin_skin', onDelete: 'cascade' });
  }

  return Skin;
};