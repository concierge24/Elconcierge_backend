const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admin_section', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sections_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    section_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admin_section_category',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'admin_sections',
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
        name: "section_category_id",
        using: "BTREE",
        fields: [
          { name: "section_category_id" },
        ]
      },
    ]
  });
};
