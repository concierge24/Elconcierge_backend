const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sms_email_text', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "title means subject of sms\/email"
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: sms, 1: email"
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: failed, 1: success"
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiver_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: user,1:supplier"
    }
  }, {
    sequelize,
    tableName: 'sms_email_text',
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
