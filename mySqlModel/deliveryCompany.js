const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('delivery_company', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    is_block: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_verified: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    device_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    country_code: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    longitude: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    delivery_radius: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    radius_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    base_delivery_charges: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    distance_value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    iso: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    delivery_min_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 15
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    license_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    letter_of_intent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preferred_language: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    coverage_cities: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    more_information: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    license_image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type_of_deliveries_offered: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    booking_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    no_of_motorbike_controlled_temp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    no_of_motorbike_non_controlled_temp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    no_of_cars: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    no_of_vans_controlled_temp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    no_of_vans_non_controlled_temp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'delivery_companies',
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
