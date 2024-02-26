const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_referral', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    from_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    to_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ready_for_use: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    given_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    receive_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    price_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0-flat 1 for %"
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'user_referral',
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
