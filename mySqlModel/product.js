const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price_unit: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "1"
    },
    bar_code: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    product_desc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    measuring_unit: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sku: {
      type: DataTypes.TEXT,
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
      comment: "0: value, 1: percentage"
    },
    commission: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    commission_package: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recurring_possible: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    scheduling_possible: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_package: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_live: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_global: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: not global, 1: global"
    },
    added_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0: admin, 1: supplier, 2: supplier branch"
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approved_by_supplier: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approved_by_admin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pricing_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      comment: "0: fixed pricing, 1: hourly pricing"
    },
    quantity: {
      type: DataTypes.DECIMAL(11,2),
      allowNull: false,
      defaultValue: 0.00
    },
    purchased_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_available: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    avg_rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    total_rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    total_review: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_product: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    interval_flag: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0:per\/hr 1: p\/day 2:p\/week 3:p\/month 4: p\/year 5: p\/km"
    },
    interval_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_non_veg: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0-for veg and 1-for non veg"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_prescribed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    b_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    customTabDescription1: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "labelDBColName in productCustomTabDescriptionLabel tbl_setting"
    },
    customTabDescription2: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "labelDBColName in productCustomTabDescriptionLabel tbl_setting"
    },
    payment_after_confirmation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "used for making an payment after order cofirmation of product "
    },
    cart_image_upload: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "used for adding an image during making an orde of thi order "
    },
    promo_level: {
      type: DataTypes.ENUM('0','1','2','3'),
      allowNull: false,
      comment: "0-notApplied, 1-region, 2-category, 3-product"
    },
    making_price: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "0"
    },
    product_tags: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "comma separated tags"
    },
    item_unavailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    country_of_origin: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Size_chart_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pos_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "id of product from pos import"
    },
    videoUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    purchase_limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_subscription_required: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_allergy_product: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    allergy_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_appointment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    promo_applied: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "0"
    }
  }, {
    sequelize,
    tableName: 'product',
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
        name: "id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "category_id",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });
};
