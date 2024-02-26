const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_delivery_charge', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    base_delivery_charges: {
      type: DataTypes.DECIMAL(6,3),
      allowNull: true,
      comment: "base charges for a specified distance ie distance_value"
    },
    distance_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "1-upton nth per\/km value"
    },
    added_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'supplier_delivery_charges',
    timestamps: false
  });
};
