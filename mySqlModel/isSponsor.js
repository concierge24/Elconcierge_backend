const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('is_sponsor', {
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
    logo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    supplier_image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    mobile_number_1: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    mobile_number_2: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    fax: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: closed, 1: open, 2: busy"
    },
    trade_license_no: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    uniqueness: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    terms_and_conditions: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_active: {
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
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_recommended: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: yes, 0 : no"
    },
    pricing_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: supplier level, 1: product level"
    },
    handling_admin: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    handling_supplier: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    urgent_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: value, 1: percentage"
    },
    urgent_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    is_urgent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_postpone: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rating: {
      type: DataTypes.DECIMAL(3,1),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: cash, 1: card, 2: both"
    },
    step_completed: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    business_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    delivery_prior_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_prior_days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_prior_total_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_min_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_max_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urgent_delivery_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_rating_by_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    device_token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    device_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    commisionButton: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_sponser: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    urgentButton: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'is_sponsor',
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
