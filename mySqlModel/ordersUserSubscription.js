const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders_user_subscription', {
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
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "user subscription plan id"
    },
    order_total_amount: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "total amount of order"
    },
    total_discount_amount: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "total amount of benefit given in term of discount"
    },
    benefit_types_list: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "list of applied benefits, comma separated, for example - FDM, B1G1M"
    },
    discount_amount_per_benefit: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "for example - FDM(-50), B1G1M(-65) "
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'orders_user_subscription',
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
