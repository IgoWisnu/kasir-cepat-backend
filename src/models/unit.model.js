module.exports = (sequelize, DataTypes) => {
  const Unit = sequelize.define('Unit', {
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
    unit_type: {
      type: DataTypes.ENUM('fixed', 'variable'),
      allowNull: true
    }
  }, {
    tableName: 'unit',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Unit.associate = (models) => {
    Unit.belongsTo(models.Business, { foreignKey: 'business_id' });
    Unit.hasMany(models.Inventory, { foreignKey: 'unit_id' });
  };

  return Unit;
};
