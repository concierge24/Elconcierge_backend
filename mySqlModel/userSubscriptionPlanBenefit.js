const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_subscription_plan_benefit', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    benefit_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'user_subscription_plan_benefits',
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
        name: "plan_id",
        using: "BTREE",
        fields: [
          { name: "plan_id" },
        ]
      },
      {
        name: "benefit_id",
        using: "BTREE",
        fields: [
          { name: "benefit_id" },
        ]
      },
    ]
  });
};
