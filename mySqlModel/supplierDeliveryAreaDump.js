const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_delivery_area_dump', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dump_supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    zone: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    area: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    delivery_charges: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    min_order: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    charges_below_min_order: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'supplier_delivery_area_dump',
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
        name: "dump_supplier_id",
        using: "BTREE",
        fields: [
          { name: "dump_supplier_id" },
        ]
      },
    ]
  });
};
