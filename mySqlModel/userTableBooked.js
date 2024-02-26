const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_table_booked', {
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
    table_id: {
      type: DataTypes.INTEGER,
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
      defaultValue: "1990-01-01 21:50:00"
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_on_the_way: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_in_range: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    amount: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: false,
      defaultValue: 0.00
    },
    payment_source: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reciept_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'user_table_booked',
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
