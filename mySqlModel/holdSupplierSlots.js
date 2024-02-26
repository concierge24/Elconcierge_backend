const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hold_supplier_slots', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'hold_supplier_slots',
    timestamps: false
  });
};
