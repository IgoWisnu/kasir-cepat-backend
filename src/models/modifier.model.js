module.exports = (sequelize, DataTypes) => {
  const Modifier = sequelize.define('Modifier', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    modifier_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    }
  }, {
    tableName: 'modifier',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Modifier.associate = (models) => {
    Modifier.belongsTo(models.Modifier_group, { foreignKey: 'modifier_group_id' });
    Modifier.hasMany(models.Order_detail_modifier, { foreignKey: 'modifier_id' });
  };

  return Modifier;
};
