const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shiprocket_shipment', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    shipment_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    awb_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    label_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    manifest_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pickup_token_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'shiprocket_shipment',
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
