module.exports = (sequelize, DataTypes) => {
  const Payment_method = sequelize.define('Payment_method', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    outlet_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: true
    }
  }, {
    tableName: 'payment_method',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Payment_method.associate = (models) => {
    Payment_method.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
    Payment_method.hasMany(models.Payments, { foreignKey: 'payment_method_id' });
  };

  return Payment_method;
};
