module.exports = (sequelize, DataTypes) => {
  const Title = sequelize.define('Title', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{allowNull: false, type: DataTypes.STRING}
  },{timestamps: false});

  Title.associate = function(models){
    Title.belongsToMany(models.Tamer, {through: 'Tamer_Title', foreignKey: 'fk_tamer_title_title', onDelete: 'cascade' });
  }

  return Title;
};