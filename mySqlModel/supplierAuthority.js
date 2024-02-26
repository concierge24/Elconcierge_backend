const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_authority', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    supplier_section_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    supplier_admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: admin , 1: supplier"
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'supplier_authority',
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
        name: "supplier_section_id",
        using: "BTREE",
        fields: [
          { name: "supplier_section_id" },
        ]
      },
      {
        name: "supplier_admin_id",
        using: "BTREE",
        fields: [
          { name: "supplier_admin_id" },
        ]
      },
    ]
  });
};
