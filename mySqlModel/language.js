const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('language', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    language_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    language_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    default_language: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_live: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "1- live"
    },
    rtl: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    country_code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "ae"
    }
  }, {
    sequelize,
    tableName: 'language',
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
