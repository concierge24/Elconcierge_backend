const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedule_weekly', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    monday: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    schedule_id: {
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
    thrusday: {
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
    }
  }, {
    sequelize,
    tableName: 'schedule_weekly',
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
