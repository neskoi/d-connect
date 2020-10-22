module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define('Field',{
    
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{allowNull: false, type: DataTypes.STRING(20), unique: true, validate:{isAlpha: true}},

  },{timestamps: false});

  
  Field.associate = function(models) {
    Field.hasMany(models.Mon, {foreignKey: 'fk_mon_field', onDelete: 'cascade' });
    Field.hasMany(models.Background, {foreignKey: 'fk_background_field', onDelete: 'cascade' });
  };

  return Field;
};