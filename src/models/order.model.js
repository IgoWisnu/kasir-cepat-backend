module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    outlet_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shift_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bill_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order_type: {
      type: DataTypes.ENUM('dine_in', 'takeaway', 'online'),
      allowNull: false
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cust_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order_status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
      allowNull: true
    },
    payment_status: {
      type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
      allowNull: true
    },
    subtotal: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    service_amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    discount_amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    }
  }, {
    tableName: 'order',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

  });

  Order.associate = (models) => {
    Order.belongsTo(models.Business, { foreignKey: 'business_id' });
    Order.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
    Order.belongsTo(models.User, { foreignKey: 'user_id' });
    Order.belongsTo(models.Shift, { foreignKey: 'shift_id' });
    Order.belongsTo(models.Outlet_tables, { foreignKey: 'table_id' });
    Order.hasMany(models.Order_detail, { foreignKey: 'order_id' });
    Order.hasMany(models.Payments, { foreignKey: 'order_id' });
  };

  return Order;
};
