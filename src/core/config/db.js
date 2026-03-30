const {sequelize} = require('sequelize');
const { Sequelize } = require('../../models');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Ubah ke console.log jika ingin melihat raw SQL yang dieksekusi
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

sequelize.authenticate()
    .then(() => console.log('Koneksi Sequelize ke MySQL berhasil!'))
    .catch((err) => console.error('Gagal terkoneksi:', err));

module.exports = sequelize;