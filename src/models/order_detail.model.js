module.exports = (sequelize, DataTypes) => {
  const Order_detail = sequelize.define('Order_detail', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    price_at_purchase: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    base_price: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    discount_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discount_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    discount_type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: true
    },
    discount_value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    discount_amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    service_amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    is_open_price: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'order_detail',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Order_detail.associate = (models) => {
    Order_detail.belongsTo(models.Order, { foreignKey: 'order_id' });
    Order_detail.belongsTo(models.Item, { foreignKey: 'item_id' });
    Order_detail.belongsTo(models.Discount, { foreignKey: 'discount_id' });
    Order_detail.hasMany(models.Order_detail_modifier, { foreignKey: 'order_detail_id' });
    Order_detail.hasMany(models.Payment_details, { foreignKey: 'order_detail_id' });
  };

  return Order_detail;
};
