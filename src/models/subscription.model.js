module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'cancelled', 'pending'),
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
    last_payment_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'subscription',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

  });

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.Business, { foreignKey: 'business_id' });
    Subscription.belongsTo(models.Subscription_plan, { foreignKey: 'plan_id' });
    Subscription.hasMany(models.Subscription_payments, { foreignKey: 'subscription_id' });
  };

  return Subscription;
};
