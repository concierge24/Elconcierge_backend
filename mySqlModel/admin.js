const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admin', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    iso: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    country_code: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    fcm_token: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "0",
      comment: "token for push notification"
    },
    phone_number: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    is_superadmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "1-superadmin"
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "1-active"
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    socket_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    user_created_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "used to uniquely identify the admin over socket"
    }
  }, {
    sequelize,
    tableName: 'admin',
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
