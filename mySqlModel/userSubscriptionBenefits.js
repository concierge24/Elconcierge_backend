const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_subscription_benefits', {
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
      allowNull: false,
      comment: "description about the benefits"
    },
    benefit_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "unique id for a group, for example if a user select FDW then it means a benefit from a group is selected so that user should not select FDM or FDY as it lies in same group"
    },
    benefit_type: {
      type: DataTypes.ENUM('FD','B1G1','SP'),
      allowNull: false,
      comment: "'FD' - Free Delivery 'B1G1'- buy 1 get 1 'SP' - Special Promocode"
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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    no_of_delivery: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "number of free delivery"
    }
  }, {
    sequelize,
    tableName: 'user_subscription_benefits',
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
