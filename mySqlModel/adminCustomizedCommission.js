const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admin_customized_commission', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    minimum_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 10,
      comment: "stored an minimum order amount"
    },
    below_commission_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "0-flat 1-presentage"
    },
    above_commission_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "0-flat 1-presentage"
    },
    below_commission_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 10,
      comment: "minimum admin commision amount"
    },
    above_commission_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 10,
      comment: "maximum admin commision amount"
    },
    minimum_cart_fee: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: "cart fees will be apply if order amount is less that minimumn amount"
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_date: {
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
    tableName: 'admin_customized_commission',
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
