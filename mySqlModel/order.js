const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    supplier_branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0 :pending,1:confirm,2:reject, 3: shipped, 4:nearby,5:delivered,6:rating_by_user,7:tracked,8:customer_cancel,9:schedule"
    },
    order_source: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: app,1: web"
    },
    handling_admin: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    slot_price: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false,
      defaultValue: 0.00
    },
    handling_supplier: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    delivery_charges: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    net_amount: {
      type: DataTypes.DECIMAL(9,2),
      allowNull: false
    },
    waiting_charges: {
      type: DataTypes.DECIMAL(9,2),
      allowNull: false
    },
    refund_amount: {
      type: DataTypes.DECIMAL(9,2),
      allowNull: false,
      defaultValue: 0.00
    },
    gst_charges: {
      type: DataTypes.DECIMAL(9,2),
      allowNull: false,
      defaultValue: 0.00
    },
    loyalty_points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    min_order_delivery_crossed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    service_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "dispatching date"
    },
    pickup_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    pickup_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1990-01-01"
    },
    delivery_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    preparation_pickup_date_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    preparation_time: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00"
    },
    is_recurring: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urgent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urgent_price: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    schedule_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "1990-01-01 21:50:00"
    },
    schedule_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    remarks_images_array: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    payment_source: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    card_payment_id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pickup_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_pickup_address: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_delivery_address: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_address_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    was_postponed: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    approve_rejection_reason: {
      type: DataTypes.STRING(11),
      allowNull: false
    },
    delivered_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivered_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shipped_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    near_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    progress_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    confirmed_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    payment_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:cash,1:online"
    },
    schedule_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: no schedule order , 1: schedule order"
    },
    is_read: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0-not_read;1-read"
    },
    is_automatic: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    read_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "adminId"
    },
    info: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    rated_on: {
      type: DataTypes.DATE,
      allowNull: false
    },
    CommentApprove: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_package: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_acknowledged: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    push_sent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    apply_promo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    redeem_promo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    promo_code: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    promo_discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    is_agent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tip_agent: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    buffer_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    self_pickup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "0=for delivery 1= for self-pickup"
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    from_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    to_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    from_latitude: {
      type: DataTypes.DECIMAL(20,16),
      allowNull: false,
      defaultValue: 0.0000000000000000
    },
    to_longitude: {
      type: DataTypes.DECIMAL(20,16),
      allowNull: false,
      defaultValue: 0.0000000000000000
    },
    from_longitude: {
      type: DataTypes.DECIMAL(20,16),
      allowNull: false,
      defaultValue: 0.0000000000000000
    },
    to_latitude: {
      type: DataTypes.DECIMAL(20,16),
      allowNull: false,
      defaultValue: 0.0000000000000000
    },
    supplier_commision: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    Server_Date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    questions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "json format"
    },
    pres_image1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pres_image2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pres_image3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pres_image4: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pres_image5: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pres_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    referral_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    zelle_receipt_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_service_charge: {
      type: DataTypes.DECIMAL(6,3),
      allowNull: false,
      defaultValue: 0.000
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:order created by user 1: order created by admin-supplier"
    },
    payment_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0 payment not paid 1-for paid"
    },
    partial_prescription: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "1:some of item does’t have pres 0: all have pres or not"
    },
    payment_after_confirmation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "1 : payment after confmation  suppler\/admin 0: payment before order creation "
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "For terminology acc to ecomm-home-foo platform "
    },
    have_pet: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parking_instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cleaner_in: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    area_to_focus: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gift_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    delivery_date_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    is_edit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    edit_by: {
      type: DataTypes.ENUM('','admin','agent'),
      allowNull: true,
      defaultValue: ""
    },
    remaining_amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    donate_to_someone: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    supplier_stripe_transfer_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "stripe transfer id against this order. Required in case admin refunds"
    },
    is_schedule: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    wallet_amount_used: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false,
      defaultValue: 0.00
    },
    wallet_discount_amount: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false,
      defaultValue: 0.00
    },
    loyality_point_discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    user_on_the_way: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_loyality_point_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    have_coin_change: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_dhl_assigned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    agent_base_price: {
      type: DataTypes.DECIMAL(9,2),
      allowNull: true,
      defaultValue: 0.00,
      comment: "base price of agent"
    },
    agent_delivery_charge_share: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true,
      defaultValue: 0.00,
      comment: "share of agent in delivery charge"
    },
    ip_address: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    is_dine_in: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    android_version: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    ios_version: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    zone_offset: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    agent_verification_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    is_cutlery_required: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    admin_updated_charge: {
      type: DataTypes.DECIMAL(10,3),
      allowNull: false,
      defaultValue: 0.000
    },
    admin_price_update_receipt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    drop_off_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    is_shiprocket_assigned: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_tax_add: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_subtotal_add: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    table_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    zoom_call_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "url to join a call"
    },
    zoom_call_start_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "url to start a call"
    },
    drop_off_date_utc: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    order_delivery_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    vehicle_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    proxy_phone_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'orders',
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
