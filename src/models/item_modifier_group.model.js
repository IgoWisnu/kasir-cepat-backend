module.exports = (sequelize, DataTypes) => {
  const Item_modifier_group = sequelize.define('Item_modifier_group', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modifier_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'item_modifier_group',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Item_modifier_group.associate = (models) => {
    Item_modifier_group.belongsTo(models.Item, { foreignKey: 'item_id' });
    Item_modifier_group.belongsTo(models.Modifier_group, { foreignKey: 'modifier_group_id' });
  };

  return Item_modifier_group;
};
