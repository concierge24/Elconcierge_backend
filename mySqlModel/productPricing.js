const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_pricing', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_type: {
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
    offer_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    display_price: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    handling: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    handling_supplier: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    can_urgent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urgent_price: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    house_cleaning_price: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    beauty_saloon_price: {
      type: DataTypes.DECIMAL(7,2),
      allowNull: false
    },
    commission: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false,
      comment: "in percentage"
    },
    delivery_charges: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: regular, 1: festive"
    },
    commission_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: value, 1: percentage"
    },
    urgent_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: value, 1: percentage"
    },
    min_hour: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_hour: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    per_hour_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urgent_value: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    pricing_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: fixed pricing, 1: hourly pricing"
    },
    gst_price: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    user_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'product_pricing',
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
        name: "product_id",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
};
