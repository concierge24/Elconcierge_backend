const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cache', {
    onOff: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    reset: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: "0"
    },
    cachTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10
    }
  }, {
    sequelize,
    tableName: 'cache',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "onOff" },
        ]
      },
    ]
  });
};
