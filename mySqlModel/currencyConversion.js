const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('currency_conversion', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    conversion_rate: {
      type: DataTypes.DECIMAL(5,3),
      allowNull: false
    },
    currency_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    currency_symbol: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    currency_description: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    country_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'currency_conversion',
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
