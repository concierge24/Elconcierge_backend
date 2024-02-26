const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account_receivable_subscription', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    account_receivable_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    service_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:subscription;1:advertisement"
    },
    advertisement_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    transaction_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:not_paid,1:paid"
    },
    starting_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ending_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ads_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'account_receivable_subscriptions',
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
