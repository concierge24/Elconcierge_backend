const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_branch', {
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
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    branch_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    handling_fees: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    commission: {
      type: DataTypes.DECIMAL(5,2),
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
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mobile_1: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mobile_2: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fax: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
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
    delivery_start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    delivery_end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    working_start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    working_end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    monday_open: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tuesday_open: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wednesday_open: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    thursday_open: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    friday_open: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    saturday_open: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sunday_open: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    min_order: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    min_order_delivery: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    min_order_delivery_charge: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    delivery_charges: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    is_head_branch: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: yes , 0: no"
    },
    urgent_delivery: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postponed_delivery: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urgent_delivery_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "in hours"
    },
    device_token: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    device_type: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    is_superadmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    country_code: {
      type: DataTypes.STRING(16),
      allowNull: true,
      defaultValue: ""
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    iso: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'supplier_branch',
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
