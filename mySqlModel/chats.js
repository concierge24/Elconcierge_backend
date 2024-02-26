const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('chats', {
    c_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    send_to: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    send_by: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    message_id: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    sent_at: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    send_to_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    send_by_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    original: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    thumbnail: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    chat_type: {
      type: DataTypes.BLOB,
      allowNull: false,
      defaultValue: "text"
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    send_to_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "agent, user, supplier, admin"
    },
    send_by_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "agent, user, supplier, admin"
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chats',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "c_id" },
        ]
      },
    ]
  });
};
