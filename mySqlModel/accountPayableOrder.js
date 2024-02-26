const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account_payable_order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    account_payable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account_payable',
        key: 'id'
      }
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    order_transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: "netAmount-(handlingAdmin+commission)"
    },
    total_paid: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    total_left: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:unpaid;1-fullyPaid;2-partiallyPaid"
    },
    transaction_mode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:cash,1:DD,2: cheque,3:NEFT"
    },
    payment_transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    commission: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'account_payable_order',
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
        name: "account_payable_id",
        using: "BTREE",
        fields: [
          { name: "account_payable_id" },
        ]
      },
      {
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "order_id_2",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "account_payable_id_2",
        using: "BTREE",
        fields: [
          { name: "account_payable_id" },
        ]
      },
    ]
  });
};
