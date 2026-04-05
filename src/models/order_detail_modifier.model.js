module.exports = (sequelize, DataTypes) => {
  const Order_detail_modifier = sequelize.define('Order_detail_modifier', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    order_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modifier_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modifier_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'order_detail_modifier',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Order_detail_modifier.associate = (models) => {
    Order_detail_modifier.belongsTo(models.Order_detail, { foreignKey: 'order_detail_id' });
    Order_detail_modifier.belongsTo(models.Modifier, { foreignKey: 'modifier_id' });
  };

  return Order_detail_modifier;
};
