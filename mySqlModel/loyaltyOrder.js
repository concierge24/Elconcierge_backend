const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('loyalty_order', {
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
    delivery_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_address_id: {
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
    total_points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    service_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    urgent: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urgent_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    remarks: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    was_postponed: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivered_by: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    delivered_on: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    shipped_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    near_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'loyalty_order',
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
