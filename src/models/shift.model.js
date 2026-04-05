module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define('Shift', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    outlet_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    open_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    close_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cash_start: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    cash_close: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    cash_different: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'Shift',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,

  });

  Shift.associate = (models) => {
    Shift.belongsTo(models.User, { foreignKey: 'user_id' });
    Shift.belongsTo(models.Outlet, { foreignKey: 'outlet_id' });
    Shift.hasMany(models.Order, { foreignKey: 'shift_id' });
  };

  return Shift;
};
