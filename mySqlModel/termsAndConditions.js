const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('terms_and_conditions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    terms_and_conditions: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    faq: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    about_us: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    faqs: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    language_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'terms_and_conditions',
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
