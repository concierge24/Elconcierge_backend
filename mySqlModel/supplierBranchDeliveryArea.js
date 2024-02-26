const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_branch_delivery_area', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    supplier_branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area_id: {
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
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'supplier_branch_delivery_areas',
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
        name: "supplier_branch_id",
        using: "BTREE",
        fields: [
          { name: "supplier_branch_id" },
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
