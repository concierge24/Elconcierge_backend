const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('booking_cart_flow', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    vendor_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1-for multiple vendor 0-for single vendor"
    },
    cart_flow: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0-for single product 1-form multiple 2- for multiple product with quantity "
    },
    is_scheduled: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1-for can shedule order 0-for can`t"
    },
    schedule_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "shedule time in days"
    },
    admin_order_priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1-for firstly admin accept order 0-for vendor accept order"
    },
    is_pickup_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1-for pickup 0-delivery"
    },
    is_variant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1-for product variant can add by vendor\/admin "
    },
    is_social_module: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1-yes 0-no"
    },
    booking_track_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "1-yes 0-no"
    },
    interval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      comment: "0: eCommerce 1: Food 2: Fitness 3: Beauty 4: Home Service"
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
    branch_flow: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0-for single branch product 1 for multiple branch product"
    }
  }, {
    sequelize,
    tableName: 'booking_cart_flow',
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
        name: "is_pickup_order",
        using: "BTREE",
        fields: [
          { name: "is_pickup_order" },
        ]
      },
    ]
  });
};
