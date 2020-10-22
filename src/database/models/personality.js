module.exports = (sequelize, DataTypes)=> {
  const Personality = sequelize.define('Personality',{
    
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{allowNull:false, type: DataTypes.STRING(20)},

  },{timestamps: false});

  Personality.associate = function(models) {
    Personality.hasMany(models.Tamermon, {foreignKey: 'fk_tamermon_personality', onDelete: 'cascade' });
  };

  return Personality;
};