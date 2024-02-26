const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_app_version', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    android_version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ios_version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_forced_android: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: forced update, 0 : no"
    },
    is_forced_ios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: forced update, 0 : no"
    }
  }, {
    sequelize,
    tableName: 'supplier_app_version',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
