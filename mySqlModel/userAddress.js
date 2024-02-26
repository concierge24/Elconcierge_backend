const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_address', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address_line_1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address_line_2: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pincode: {
      type: DataTypes.STRING(2000),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    landmark: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    directions_for_delivery: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address_link: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    customer_address: {
      type: DataTypes.STRING(255),
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
    phone_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(20,16),
      allowNull: false,
      defaultValue: 0.0000000000000000
    },
    longitude: {
      type: DataTypes.DECIMAL(20,16),
      allowNull: false,
      defaultValue: 0.0000000000000000
    },
    is_default: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    collectNumber: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "click\/ collect no. "
    },
    reference_address: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_address',
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
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
