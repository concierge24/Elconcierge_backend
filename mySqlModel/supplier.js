const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    supplier_image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    iso: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    country_code: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    mobile_number_1: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    mobile_number_2: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    fax: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "0: closed, 1: open, 2: busy"
    },
    trade_license_no: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    uniqueness: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    terms_and_conditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_live: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    preparation_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00"
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
    urgentButton: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_sponser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    rating_total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    self_pickup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0=delivery 1=pickup"
    },
    latitude: {
      type: DataTypes.DECIMAL(20,16),
      allowNull: false,
      defaultValue: 0.0000000000000000
    },
    longitude: {
      type: DataTypes.DECIMAL(20,16),
      allowNull: false,
      defaultValue: 0.0000000000000000
    },
    delivery_radius: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 20
    },
    is_area_restricted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    delivery_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    commission: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    radius_price: {
      type: DataTypes.DECIMAL(6,3),
      allowNull: false,
      defaultValue: 20.000
    },
    measuring_unit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0=km 1=miles"
    },
    pickup_commission: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    user_service_charge: {
      type: DataTypes.DECIMAL(6,3),
      allowNull: false,
      defaultValue: 0.000
    },
    license_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    user_request_flag: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    fcm_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    speciality: {
      type: DataTypes.STRING(266),
      allowNull: true,
      defaultValue: ""
    },
    nationality: {
      type: DataTypes.STRING(266),
      allowNull: true,
      defaultValue: ""
    },
    facebook_link: {
      type: DataTypes.STRING(266),
      allowNull: true,
      defaultValue: ""
    },
    linkedin_link: {
      type: DataTypes.STRING(266),
      allowNull: true,
      defaultValue: ""
    },
    brand: {
      type: DataTypes.STRING(266),
      allowNull: true,
      defaultValue: ""
    },
    base_delivery_charges: {
      type: DataTypes.DECIMAL(10,6),
      allowNull: false,
      defaultValue: 0.000000
    },
    documents: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    distance_value: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-upton nth per\/km value"
    },
    stripe_account: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "supplier stripe account token to receive money"
    },
    productCustomTabDescriptionLabelSelected: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "productCustomTabDescriptionLabelSelected, store uniqueId"
    },
    customTabDescription3: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "customTabDescription3, add by admin"
    },
    gst_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    is_dine_in: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    socket_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    user_created_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "used to uniquely identify the supplier over socket"
    },
    country_of_origin: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    is_scheduled: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    currency_exchange_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    local_currency: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    federal_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_counter_self_service: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tap_business_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "supplier tap business id"
    },
    tap_business_entity_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "supplier tap business entity id"
    },
    tap_destination_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "supplier tap destination id"
    },
    is_own_delivery: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    home_chef_orignal_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    home_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    license_issue_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    license_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    license_document: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_out_network: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_user_service_charge_flat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_products_offer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    offerValue: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: false,
      defaultValue: 0.00
    },
    table_booking_price: {
      type: DataTypes.DECIMAL(6,3),
      allowNull: true,
      defaultValue: 0.000
    },
    experience_level_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'supplier',
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
