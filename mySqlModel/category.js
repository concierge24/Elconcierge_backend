const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    order: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    new_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tax: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    supplier_placement_level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_placement_level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_live: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    icon: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    illustration: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_flow: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_barcode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chemical_tools_price_applicable: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    services_at_home_price_applicable: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_addition_level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_variant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    agent_list: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_agent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_default: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00"
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00"
    },
    terminology: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    order_instructions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    cart_image_upload: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    payment_after_confirmation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "1 : payment after confmation  suppler\/admin 0: payment before order creation "
    },
    menu_type: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true,
      defaultValue: "1",
      comment: "where to show cateogry(0 - menu, 1 - restaurant) (1 means category is related to restaurant and 1 means not related to category)"
    },
    is_dine: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    sequence_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    is_service_single_selection: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'categories',
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
