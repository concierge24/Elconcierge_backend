const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('feedback', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    from_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    from_user_type: {
      type: DataTypes.ENUM('USER','SUPPLIER','AGENT','GUEST'),
      allowNull: false,
      defaultValue: "USER"
    },
    suggestions_assigned: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    new_suggestions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false
    },
    new_suggestion_description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "description of new suggestion"
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'feedback',
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
