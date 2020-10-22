'use strict';
module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
    language:{type: DataTypes.STRING(2), primaryKey: true, validate:{notEmpty: true}},
  },{timestamps: false});

  Language.associate = function(models) {
    Language.hasMany(models.Tamer, {foreignKey: 'fk_tamer_language', onDelete: 'cascade' });
  };

  return Language;
};