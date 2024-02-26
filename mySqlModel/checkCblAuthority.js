const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('check_cbl_authority', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    is_block: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    is_free_trial: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    is_white_label: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    payment_status: {
      type: DataTypes.ENUM('PENDING','PAID'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    business_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    help_email: {
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
    }
  }, {
    sequelize,
    tableName: 'check_cbl_authority',
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
