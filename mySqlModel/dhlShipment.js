const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dhl_shipment', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    bar_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shipping_charge: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    package_charge: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    chargeabl_weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    airway_bill_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    base64_image: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'dhl_shipment',
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
