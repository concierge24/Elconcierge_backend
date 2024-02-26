const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cart_products', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cart',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_charge: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    quantity: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    handling_admin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    handling_supplier: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    price_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1:hourly,0:regular"
    },
    supplier_branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      references: {
        model: 'supplier_branch',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    loyality_discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: "Used for store an loyalit discount If user reached loyalty level"
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
    },
    agentBufferPrice: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: false,
      defaultValue: 0.00
    }
  }, {
    sequelize,
    tableName: 'cart_products',
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
        name: "cart_id",
        using: "BTREE",
        fields: [
          { name: "cart_id" },
        ]
      },
      {
        name: "product_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "supplier_branch_id",
        using: "BTREE",
        fields: [
          { name: "supplier_branch_id" },
        ]
      },
    ]
  });
};
