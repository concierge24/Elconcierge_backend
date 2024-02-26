const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_recurring', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "It should be order id"
    },
    monday: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tuesday: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wednesday: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    thursday: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    friday: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    saturday: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sunday: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recurring_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'order_recurring',
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
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
