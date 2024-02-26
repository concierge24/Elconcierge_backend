const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('push_notification', {
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
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notification_message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notification_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1 : order accepted,2: order rejected,4:order Tracked"
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('current_timestamp')
    },
    is_read: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_supplier: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    notification_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_sos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    longitude: {
      type: DataTypes.DECIMAL(20,16),
      allowNull: false,
      defaultValue: 0.0000000000000000
    },
    latitude: {
      type: DataTypes.DECIMAL(20,16),
      allowNull: false,
      defaultValue: 0.0000000000000000
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    device_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'push_notifications',
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
