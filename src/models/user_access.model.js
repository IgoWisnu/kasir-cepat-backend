module.exports = (sequelize, DataTypes) => {
  const User_access = sequelize.define('User_access', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    outlet_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('owner', 'manager', 'cashier'),
      allowNull: false
    }
  }, {
    tableName: 'user_access',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,

  });

  User_access.associate = (models) => {
    User_access.belongsTo(models.User, { foreignKey: 'user_id' });
    User_access.belongsTo(models.Business, { foreignKey: 'business_id' });
    User_access.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
  };

  return User_access;
};
