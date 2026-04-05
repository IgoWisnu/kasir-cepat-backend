module.exports = (sequelize, DataTypes) => {
  const Outlet = sequelize.define('Outlet', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    business_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tax_rate: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    service_rate: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    }
  }, {
    tableName: 'Outlet',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  });

  Outlet.associate = (models) => {
    Outlet.belongsTo(models.Business, { foreignKey: 'business_id' });
    Outlet.hasMany(models.User_access, { foreignKey: 'outlet_id' });
    Outlet.hasMany(models.Shift, { foreignKey: 'outlet_id' });
    Outlet.hasMany(models.Inventory, { foreignKey: 'outlet_id' });
    Outlet.hasMany(models.Payment_method, { foreignKey: 'outlet_id' });
    Outlet.hasMany(models.Order, { foreignKey: 'outlet_id' });
  };

  return Outlet;
};
