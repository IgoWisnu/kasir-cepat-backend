module.exports = (sequelize, DataTypes) => {
  const Modifier_group = sequelize.define('Modifier_group', {
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
    selection_type: {
      type: DataTypes.ENUM('single', 'multiple'),
      allowNull: false
    }
  }, {
    tableName: 'modifier_group',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Modifier_group.associate = (models) => {
    Modifier_group.belongsTo(models.Business, { foreignKey: 'business_id' });
    Modifier_group.hasMany(models.Modifier, { foreignKey: 'modifier_group_id' });
    Modifier_group.hasMany(models.Item_modifier_group, { foreignKey: 'modifier_group_id' });
  };

  return Modifier_group;
};
