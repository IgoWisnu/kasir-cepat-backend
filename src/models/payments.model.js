module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define('Payments', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Payments.associate = (models) => {
    Payments.belongsTo(models.Order, { foreignKey: 'order_id' });
    Payments.belongsTo(models.Payment_method, { foreignKey: 'payment_method_id' });
    Payments.hasMany(models.Payment_details, { foreignKey: 'payment_id' });
  };

  return Payments;
};
