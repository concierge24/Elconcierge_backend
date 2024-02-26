const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cart_variant', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    variant_val_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    variant_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    variant_value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    variant_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bar_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'cart_variant',
    timestamps: false
  });
};
