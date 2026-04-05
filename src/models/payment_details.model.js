module.exports = (sequelize, DataTypes) => {
  const Payment_details = sequelize.define('Payment_details', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity_paid: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    tableName: 'payment_details',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Payment_details.associate = (models) => {
    Payment_details.belongsTo(models.Payments, { foreignKey: 'payment_id' });
    Payment_details.belongsTo(models.Order_detail, { foreignKey: 'order_detail_id' });
  };

  return Payment_details;
};
