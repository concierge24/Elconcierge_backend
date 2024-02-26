const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:Inactive;1:active"
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    device_token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    device_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: ios, 0 : android"
    },
    mobile_no: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    old_mobile_no: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_verified: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    phone_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fb_access_token: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    area_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(14,12),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(14,12),
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    is_logged_in: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: logged in"
    },
    email_verified: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: verified, 0 : not"
    },
    otp_verified: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: verified, 0 : not"
    },
    otp: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    iso: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    country_code: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    user_image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notification_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    notification_language: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 14
    },
    loyalty_points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    limit_cancel_orders: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    apple_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_sweetoo: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "1 for agent 2 for user"
    },
    socket_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    user_created_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "used to uniquely identify the user over socket"
    },
    referral_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    referral_link: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    customer_payment_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    squareup_cust_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    user_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    wallet_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    documents: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    braintree_customer_id: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "braintrees customer id for making payment"
    },
    peach_customer_id: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "peach payment gateway customer id"
    },
    total_loyality_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: "Total amount earned by user"
    },
    used_loyality_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      comment: "total loyalty amount that already used by user"
    },
    google_access_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    abn_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    business_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    authnet_profile_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    authnet_customer_ref_id: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    nhs_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    emergency_iso: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    twilio_authy_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emergency_country_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    coach_consideration: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    parent_info: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    id_for_invoice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    license_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    license_images: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
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
