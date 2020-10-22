module.exports = (sequelize, DataTypes) => {
  const Category =  sequelize.define('Category', {
    
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{allowNull: false, type: DataTypes.STRING(20), unique: true, validate:{isEmpty: true}},
 
  }, {timestamps: false});

  return Category;
};