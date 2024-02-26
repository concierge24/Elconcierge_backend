const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account_statement', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    payment_method: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:cash,1:DD,2: cheque,3:NEFT"
    },
    debit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "for Admin;vice-versa for supplier"
    },
    credit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "for Admin;vice-versa for supplier"
    }
  }, {
    sequelize,
    tableName: 'account_statement',
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
