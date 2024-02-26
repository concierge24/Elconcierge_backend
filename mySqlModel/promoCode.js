const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('promoCode', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    desc: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    promoCode: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    maxUsers: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    minPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    perUserCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    discountPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discountType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    promoType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    promo_user_subscription_type: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0",
      comment: "0 - promo code is available for all or the way by default it works with other settings, 1 - only for subscribed users"
    },
    detailsJson: {
      type: DataTypes.STRING(4500),
      allowNull: true
    },
    startDate: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    promoDesc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isDeleted: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    bear_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0 for admin, 1 for supplier, 2-Both"
    },
    commission_on: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0-for orignal_amount, 1 for discount_amount"
    },
    isActive: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    firstTime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_discount_value: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    promo_get_x_quantity: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    buy_x_get_x_arr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    max_buy_x_get: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    promo_buy_x_quantity: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    product_ids: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    category_ids: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    region_ids: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    discount_percentage_by_admin: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    discount_percentage_by_supplier: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    discount_amt_charge_by_admin: {
      type: DataTypes.FLOAT(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    discount_amt_charge_by_supplier: {
      type: DataTypes.FLOAT(10,7),
      allowNull: false,
      defaultValue: 0.0000000
    },
    promo_level: {
      type: DataTypes.ENUM('0','1','2','3'),
      allowNull: true,
      comment: "0-notApplied, 1-region, 2-category, 3-product"
    }
  }, {
    sequelize,
    tableName: 'promoCode',
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
