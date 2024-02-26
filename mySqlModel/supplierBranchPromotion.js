const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_branch_promotion', {
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
    supplier_branch_id: {
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
    offer_product_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id_2: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    promotion_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: buy x get x, 1: buy x get y,2: min amount get y"
    },
    promotion_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    promotion_price: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    promotion_image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    promotion_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'supplier_branch_promotions',
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
