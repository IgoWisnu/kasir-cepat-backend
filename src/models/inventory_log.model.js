module.exports = (sequelize, DataTypes) => {
  const Inventory_log = sequelize.define('Inventory_log', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    inventory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock_in: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    stock_out: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('purchase', 'sale', 'adjustment', 'transfer', 'waste'),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'inventory_log',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,

  });

  Inventory_log.associate = (models) => {
    Inventory_log.belongsTo(models.Inventory, { foreignKey: 'inventory_id' });
    Inventory_log.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Inventory_log;
};
