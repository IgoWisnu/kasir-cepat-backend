module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define('Discount', {
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
    discount_type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false
    },
    value: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    scope: {
      type: DataTypes.ENUM('item', 'order'),
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'discount',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,

  });

  Discount.associate = (models) => {
    Discount.belongsTo(models.Business, { foreignKey: 'business_id' });
    Discount.hasMany(models.Order_detail, { foreignKey: 'discount_id' });
  };

  return Discount;
};
