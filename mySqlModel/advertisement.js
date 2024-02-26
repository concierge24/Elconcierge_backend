const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('advertisement', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    banner_image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    phone_image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    website_image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    no_of_users: {
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
    fees: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
    },
    advertisement_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0: banner,1:notification,2:supplier extranet,3: ads sponsor,4:email marketing"
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_sent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "0:not_sent1:sent"
    },
    areaId: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: "0"
    },
    category_id: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    banner_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:web 1:app"
    },
    flow_banner_type: {
      type: DataTypes.ENUM('0','1','2'),
      allowNull: true,
      comment: "flow_banner_type is for \"advertisement_type=0\" [0-for category, 1 - restaurant, 2 - no redirection]"
    },
    orders: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: "0"
    },
    is_bottom: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    show_banner_type: {
      type: DataTypes.ENUM('0','1','2','3'),
      allowNull: false,
      defaultValue: "0",
      comment: "1- home, 2- coverImage 3- Both"
    }
  }, {
    sequelize,
    tableName: 'advertisements',
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
