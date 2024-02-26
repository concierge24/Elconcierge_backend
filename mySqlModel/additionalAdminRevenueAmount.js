const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('additional_admin_revenue_amount', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    promo_bear_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "its the amount when promo code bear by admin\/supplier"
    },
    delivery_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "its the amount left after delivery commision of delivery boy"
    },
    order_cancel_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "its the amount left after user cancel order"
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'additional_admin_revenue_amount',
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
