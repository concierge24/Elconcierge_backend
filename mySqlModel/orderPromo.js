const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_promo', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    promoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    promoCode: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: "null"
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    promoApply: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    redeemPromo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'order_promo',
    timestamps: false,
    indexes: [
      {
        name: "id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
