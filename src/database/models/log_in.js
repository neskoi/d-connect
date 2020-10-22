'use strict';
module.exports = (sequelize, DataTypes) => {
  const Log_in = sequelize.define('Log_in', {

    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_log_in_tamer:{allowNull: false, type: DataTypes.INTEGER, onDelete: "CASCADE", references:{model:'Tamer', key: 'id'}},

    log_in_at:{allowNull:false, type: DataTypes.DATE},

    logout_at:{allowNull: false, type: DataTypes.DATE},

  }, { createdAt: 'log_in_at', updatedAt: false });

  Log_in.associate = function(models) {
    Log_in.belongsTo(models.Tamer, {foreignKey: 'fk_log_in_tamer', onDelete: 'cascade' });
  };
  
  return Log_in;
};