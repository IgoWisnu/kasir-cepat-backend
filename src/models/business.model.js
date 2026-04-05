module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    business_logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Business',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  });

  Business.associate = (models) => {
    Business.hasMany(models.Subscription, { foreignKey: 'business_id' });
    Business.hasMany(models.Outlet, { foreignKey: 'business_id' });
    Business.hasMany(models.User_access, { foreignKey: 'business_id' });
    Business.hasMany(models.Categories, { foreignKey: 'business_id' });
    Business.hasMany(models.Unit, { foreignKey: 'business_id' });
    Business.hasMany(models.Discount, { foreignKey: 'business_id' });
    Business.hasMany(models.Modifier_group, { foreignKey: 'business_id' });
    Business.hasMany(models.Order, { foreignKey: 'business_id' });
  };

  return Business;
};
