const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cart', {
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
    remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    supplier_branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: standard, 1: urgent, 2: postpone"
    },
    delivery_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1990-01-01"
    },
    user_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gst_charges: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false,
      defaultValue: 0
    },
    user_pickup_address: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_delivery_address: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pickup_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    delivery_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    preparation_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00"
    },
    pickup_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1990-01-01"
    },
    net_amount: {
      type: DataTypes.DECIMAL(9,2),
      allowNull: false
    },
    urgent_price: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    min_order_delivery_crossed: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_charges: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    handling_admin: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    handling_supplier: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    promoationType: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 47
    },
    questions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addOn: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cart',
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
