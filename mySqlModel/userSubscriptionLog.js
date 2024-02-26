const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_subscription_log', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
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
      type: DataTypes.STRING(200),
      allowNull: false
    },
    payment_source: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    payment_id: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    payment_status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user_subscription_logs',
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
