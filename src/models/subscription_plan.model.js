module.exports = (sequelize, DataTypes) => {
  const Subscription_plan = sequelize.define('Subscription_plan', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    features: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'subscription_plan',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

  });

  Subscription_plan.associate = (models) => {
    Subscription_plan.hasMany(models.Subscription, { foreignKey: 'plan_id' });
  };

  return Subscription_plan;
};
