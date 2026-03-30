const { DataTypes } = require('sequelize');
const { sequelize } = require('.');

module.exports = sequelize => {

    const Business = sequelize.define('Business', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        business_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        business_logo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tableName: 'business',
        timestamps: true, // Otomatis mengisi created_at dan updated_at
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deleteAt: 'delete_at'
    });
}