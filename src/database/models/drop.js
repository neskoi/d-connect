module.exports = (sequelize, DataTypes) => {
  const Drop = sequelize.define('Drop', {

    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fk_drop_item:{allowNull: false, type: DataTypes.INTEGER, primaryKey: true, references:{model: 'Item', key: 'id'}},
    fk_drop_mon:{allowNull: false, type: DataTypes.INTEGER, primaryKey: true, references:{model: 'Mon', key: 'id'}},
    max_quantity:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 1},
    rate:{allowNull: false, type: DataTypes.INTEGER, defaultValue: 1}

  }, {timestamps: false});

  return Drop;
};