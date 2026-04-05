module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    outlet_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    unit_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    tableName: 'inventory',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at',

  });

  Inventory.associate = (models) => {
    Inventory.belongsTo(models.Item, { foreignKey: 'item_id' });
    Inventory.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
    Inventory.belongsTo(models.Unit, { foreignKey: 'unit_id' });
    Inventory.hasMany(models.Inventory_log, { foreignKey: 'inventory_id' });
  };

  return Inventory;
};
