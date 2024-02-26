const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_card', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    customer_payment_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    card_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    card_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cvc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    card_number: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    card_source: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    exp_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    exp_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_default: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    authnet_payment_profile_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_cards',
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
