const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('loyality_level', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumb_nail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    total_loyality_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "max point possibilty in one level"
    },
    is_for_all_category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    per_point_order_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: "how much net amount should be for earning the loyality points from user"
    },
    per_point_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: "store flat amount or percentage value if not flat"
    },
    per_point_amount_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0-flat 1-percentage"
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
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'loyality_level',
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
