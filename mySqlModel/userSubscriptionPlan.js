const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_subscription_plan', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "price of plan"
    },
    type: {
      type: DataTypes.ENUM('1','2','3'),
      allowNull: false,
      defaultValue: "1",
      comment: "1 - weekly,2- monthly, 3 - yearly"
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_blocked: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0",
      comment: "0 - not blocked, 1 - blocked"
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
    },
    min_order_amount: {
      type: DataTypes.DECIMAL(11,0),
      allowNull: false,
      defaultValue: 0
    },
    stripe_plan_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "stripe plan id"
    }
  }, {
    sequelize,
    tableName: 'user_subscription_plans',
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
