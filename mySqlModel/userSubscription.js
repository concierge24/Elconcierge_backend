const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_subscription', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    renew_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "required only in case of renewing a subscription, id of previously active subscription"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subscription_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    benefit_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "to save multiple comma separated benefit types "
    },
    status: {
      type: DataTypes.ENUM('0','1','2','3','4','5','6'),
      allowNull: false,
      defaultValue: "0",
      comment: "0 - inactive 1 - active 2 - expired 3 - cancelled 4 - rejected 5 - deleted 6 - not paid"
    },
    subscription_id: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_deleted: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0",
      comment: "0 - not deleted, 1 - deleted"
    },
    is_cancelled: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0",
      comment: "0 - not cancelled, 1 - cancelled"
    },
    payment_source: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "payment gateway like mumybene requires reference id to be saved, so this field is helpful in saving any additional id or info related to a transaction other than payment_id"
    },
    payment_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "to save id returned in response of a payment"
    },
    payment_status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true,
      comment: "'0' - unpaid ,'1' - paid"
    },
    price: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "price of plan at the time of purchase"
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: "1 - weekly,2- monthly, 3 - yearly"
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
    tableName: 'user_subscription',
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
