module.exports = (sequelize, DataTypes) => {
  const Subscription_payments = sequelize.define('Subscription_payments', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('success', 'failed', 'pending'),
      allowNull: false
    },
    invoice_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'subscription_payments',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Subscription_payments.associate = (models) => {
    Subscription_payments.belongsTo(models.Subscription, { foreignKey: 'subscription_id' });
  };

  return Subscription_payments;
};
