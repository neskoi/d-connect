module.exports = (sequelize, DataTypes) => {
  const Place = sequelize.define('Place', {
    
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{allowNull: false, type: DataTypes.STRING(20), validate:{isEmpty: true}}

  },{timestamps: false});

  Place.associate =  function(models){
    Place.hasMany(models.Tamermon, {foreignKey: 'fk_tamermon_place', onDelete: 'cascade' });
  };

  return Place;
};