const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_timings', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    week_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: monday, 1: tuesday, 2: wednesday,3: thursday, 4: friday,5:saturday,6:sunday"
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    is_open: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:closed;1:open;2:busy"
    }
  }, {
    sequelize,
    tableName: 'supplier_timings',
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
