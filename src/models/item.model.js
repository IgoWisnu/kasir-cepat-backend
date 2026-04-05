module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    selling_price: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    cost_price: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    low_stock_treshold: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_stock_tracked: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    allow_custom: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_composite: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'item',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  });

  Item.associate = (models) => {
    Item.belongsTo(models.Categories, { foreignKey: 'category_id' });
    Item.hasMany(models.Item_recipe, { foreignKey: 'composite_item_id' });
    Item.hasMany(models.Item_recipe, { foreignKey: 'raw_material_item_id' });
    Item.hasMany(models.Item_modifier_group, { foreignKey: 'item_id' });
    Item.hasMany(models.Inventory, { foreignKey: 'item_id' });
    Item.hasMany(models.Order_detail, { foreignKey: 'item_id' });
  };

  return Item;
};
