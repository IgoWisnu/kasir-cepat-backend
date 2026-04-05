module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    verify_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verify_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    auth_provider: {
      type: DataTypes.ENUM('local', 'google'),
      allowNull: true
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'User',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  });

  User.associate = (models) => {
    User.hasMany(models.User_access, { foreignKey: 'user_id' });
    User.hasMany(models.Shift, { foreignKey: 'user_id' });
    User.hasMany(models.Inventory_log, { foreignKey: 'user_id' });
    User.hasMany(models.Order, { foreignKey: 'user_id' });
  };

  return User;
};
