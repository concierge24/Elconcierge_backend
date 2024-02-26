const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_delivery_areas', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    zone_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_charges: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    min_order: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    charges_below_min_order: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    city_delivery_charges: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    city_min_order: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    city_charges_below_min_order: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    zone_delivery_charges: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    zone_min_order: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    zone_charges_below_min_order: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    payment_gateways: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tax: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: true
    },
    coordinates: {
      type: "POLYGON",
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'supplier_delivery_areas',
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
        name: "supplier_id",
        using: "BTREE",
        fields: [
          { name: "supplier_id" },
        ]
      },
      {
        name: "country_id",
        using: "BTREE",
        fields: [
          { name: "country_id" },
        ]
      },
      {
        name: "city_id",
        using: "BTREE",
        fields: [
          { name: "city_id" },
        ]
      },
      {
        name: "zone_id",
        using: "BTREE",
        fields: [
          { name: "zone_id" },
        ]
      },
      {
        name: "area_id",
        using: "BTREE",
        fields: [
          { name: "area_id" },
        ]
      },
    ]
  });
};
