module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag',{
    
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{allowNull: false, type: DataTypes.STRING(20), unique: true, validate:{isAlpha: true}},

  },{timestamps: false});

  
  Tag.associate = function(models) {
    Tag.hasMany(models.Post, {foreignKey: 'fk_post_tag', onDelete: 'cascade' });
  };

  return Tag;
};