const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('question_option', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    optionLabel: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    optionLabel_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "optionLabel in arabic laguage"
    },
    valueChargeType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      comment: "1:flatValue, 2: percentageValue"
    },
    flatValue: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    percentageValue: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isDelete: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'question_options',
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
