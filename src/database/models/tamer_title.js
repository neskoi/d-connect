module.exports = (sequelize, DataTypes) => {
  const Tamer_Title = sequelize.define('Tamer_Title', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_tamer_title_tamer:{type: DataTypes.INTEGER, unique: 'titleConstraint', onDelete: 'CASCADE', references:{model: 'Tamer', key: 'id'}},
    fk_tamer_title_title:{type: DataTypes.INTEGER, unique: 'titleConstraint', onDelete: 'CASCADE', references:{model: 'Title', key: 'id'}},

  },{timestamps: false});

  Tamer_Title.associate = function(models){
    Tamer_Title.belongsTo(models.Tamer, {foreignKey: 'fk_tamer_title_tamer', onDelete: 'cascade' });
    Tamer_Title.belongsTo(models.Title, {foreignKey: 'fk_tamer_title_title', onDelete: 'cascade' });
    Tamer_Title.hasMany(models.Tamer_Config,{foreignKey: 'fk_tamer_config_tamer_title', onDelete: 'cascade' });
  }

  return Tamer_Title;
};