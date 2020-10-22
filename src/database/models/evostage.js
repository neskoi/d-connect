module.exports = (sequelize, DataTypes) => {
  const Evostage = sequelize.define('Evostage',{

    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{allowNull: false, type: DataTypes.STRING(20), unique: true, validate:{isAlpha: true}}

  },{timestamps: false});

  Evostage.associate = function(models) {
    Evostage.hasMany(models.Mon, {foreignKey: 'fk_mon_evostage', onDelete: 'cascade' });
  };

  return Evostage;
};