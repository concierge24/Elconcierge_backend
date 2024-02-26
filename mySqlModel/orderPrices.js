const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_prices', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    supplier_branch_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    price: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(11,2),
      allowNull: false
    },
    gst_charges: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false,
      defaultValue: 0
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    product_desc: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    image_path: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    handling_admin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    handling_supplier: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    loyality_discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    product_reference_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    product_dimensions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    product_upload_reciept: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    product_owner_name: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'order_prices',
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
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "product_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
};
