module.exports = (sequelize, DataTypes) => {
  const Item_recipe = sequelize.define('Item_recipe', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    composite_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    raw_material_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity_used: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }
  }, {
    tableName: 'item_recipe',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Item_recipe.associate = (models) => {
    Item_recipe.belongsTo(models.Item, { foreignKey: 'composite_item_id' });
    Item_recipe.belongsTo(models.Item, { foreignKey: 'raw_material_item_id' });
  };

  return Item_recipe;
};
