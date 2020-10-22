module.exports = (sequelize, DataTypes) => {
  const Element = sequelize.define('Element',{
    
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{allowNull: false, type: DataTypes.STRING(20), unique: true, validate:{isAlpha: true}},

  },{timestamps: false});

  
  Element.associate = function(models) {
    Element.hasMany(models.Mon, {foreignKey: 'fk_mon_element', onDelete: 'cascade' });
    Element.hasMany(models.Element, {foreignKey: 'fk_skill_element', onDelete: 'cascade' });

  };

  return Element;
};