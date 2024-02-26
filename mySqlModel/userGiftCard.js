const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_gift_card', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    gift_card_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    gift_image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gift_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    percentage_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    is_used: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    transaction_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_source: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "stripe:conekta:razorpay"
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    quantity: {
      type: DataTypes.FLOAT,
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
    }
  }, {
    sequelize,
    tableName: 'user_gift_card',
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
