const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agent_supplier_payout', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('1','2'),
      allowNull: false,
      comment: "1 - driver\/agent, 2 - supplier\/restaurant"
    },
    agent_supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "id of agent or supplier on the basis of 'type' parameter"
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0",
      comment: "0 - NOT PAID, 1 - PAID"
    },
    transaction_mode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:cash,1:online"
    },
    request_status: {
      type: DataTypes.ENUM('0','1','2'),
      allowNull: false,
      defaultValue: "0",
      comment: "0 - Pending, 1 - Accepted, 2 - Reject"
    },
    payable_amount: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'agent_supplier_payouts',
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
