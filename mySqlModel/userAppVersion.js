const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_app_version', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    forced_version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_forced_ios: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_forced_android: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1 : User 0:Supplier"
    },
    device_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    version_ios: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    version_android: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    is_update_ios: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    is_update_android: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'user_app_version',
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
