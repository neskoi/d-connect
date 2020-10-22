module.exports = (sequelize, DataTypes) => {
  const Attribute = sequelize.define('Attribute',{
    
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{allowNull: false, type: DataTypes.STRING(20), unique: true, validate:{isAlpha: true}},
  },{timestamps: false});


  Attribute.associate = function(models) {
    Attribute.hasMany(models.Mon, {foreignKey: 'fk_mon_attribute', onDelete: 'cascade' });
  };

  return Attribute;
};