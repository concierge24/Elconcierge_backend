const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_dump', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reference_no: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    supplier_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    supplier_image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    supplier_email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    min_order_for_delivery: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    min_order_delivery_charge: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    delivery_charge: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    providing_delivery: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    telephone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    fax: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    primary_mobile: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    secondary_mobile: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    delivery_prior_days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_prior_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "in hrs"
    },
    minimum_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    minimum_delivery_charge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    working_days: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    working_hrs: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    payment_method: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:cod,1:card"
    },
    urgent_facility: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    urgent_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: value, 1: percentage"
    },
    urgent_price: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    house_maintenance_inspection: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: yes, 0: no"
    },
    house_maintenance_inspection_charges: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    schedule_order_facility: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    handling_fees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    commision_giving: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    commission_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: value, 1: percentage"
    },
    commission_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    web_app: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1:no,1:yes"
    },
    reaction: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:interested,1:not interested,2:moderate"
    },
    subscription_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:silver,1:gold,2:platinum,3:others"
    },
    product_images_content: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:only images,1:only content,2:both"
    },
    interest_in_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:his own rate,1:we will key in for him"
    },
    internet_available: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    estimate_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    contract_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:pending,1:rejected,2:confirmed"
    },
    advertisement_interest: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: " 0: none, 1: banner, 2:notification , 3: sponsor,4: email footer"
    },
    concerned_person_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    designation: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    rate_frequent_change: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:no,1:yes"
    },
    rate_validity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:open,1::1month,2:6month,3:year"
    },
    content_died_line: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    staff_gender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:male,1:female,2:both"
    },
    staff_remarks: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    no_of_staff: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    no_of_branches: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    about_us: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "0:Social Media ,1: TV & Radio ,2:Road Banners ,3: Referral ,4:others"
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dump_complete_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: not completed,1: completed"
    },
    subscription_period: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "0: 3 month, 1: 6 month, 2: 1 yr , else: specify text"
    },
    category_ids: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    registered_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "data gathering admin id"
    },
    business_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'supplier_dump',
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
