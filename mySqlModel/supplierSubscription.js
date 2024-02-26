const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('supplier_subscription', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    subscription_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    plan_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    current_period_start: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    current_period_end: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    created: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_cancelled: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_block: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    customer_stripe_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    jan_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    feb_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    march_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    april_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    may_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    june_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    july_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    aug_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    sep_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    oct_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    nov_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    dec_price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "admin id\/supplier id"
    },
    stripe_plan_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_source: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reciept_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_approved: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'supplier_subscription',
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
