const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('loyalty_point', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount_spent: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commission_package: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: gold,1: silver, 2: platinum"
    }
  }, {
    sequelize,
    tableName: 'loyalty_points',
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
