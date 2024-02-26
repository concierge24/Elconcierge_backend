const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_category', {
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
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    detailed_sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commission_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0: value, 1: percentage"
    },
    commission: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    commission_package: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: gold, 1: silver , 2: platinum"
    },
    is_scheduling_possible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    is_recurring_possible: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    is_sponsored: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: no, 1: yes"
    },
    urgent_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urgent_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    onOffComm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    order_no: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false,
      defaultValue: 0.00
    },
    isAdminApproveCategory: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "isAdminApproved, if 1 then live=1, is_deleted=0 in categories tbl"
    }
  }, {
    sequelize,
    tableName: 'supplier_category',
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
        name: "supplier_id",
        using: "BTREE",
        fields: [
          { name: "supplier_id" },
        ]
      },
    ]
  });
};
