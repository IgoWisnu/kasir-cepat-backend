module.exports = (sequelize, DataTypes) => {
  const Outlet_tables = sequelize.define('Outlet_tables', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available', 'occupied', 'disable'),
      allowNull: true
    }
  }, {
    tableName: 'outlet_tables',
    timestamps: false,
    createdAt: false,
    updatedAt: false,

  });

  Outlet_tables.associate = (models) => {

  };

  return Outlet_tables;
};
