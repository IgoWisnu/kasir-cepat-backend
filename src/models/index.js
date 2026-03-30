const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const sequelize = require('../config/db.config'); // Impor koneksi dari config

const db = {};

// Baca semua file di direktori saat ini (models)
fs.readdirSync(__dirname)
  .filter(file => {
    // Filter agar hanya mengambil file model javascript, bukan file ini (index.js) atau file non-js
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-9) === '.model.js'
    );
  })
  .forEach(file => {
    // Impor setiap model dan masukan ke dalam object db
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Menjalankan fungsi asosiasi jika ada
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // Tambahkan instance sequelize ke object db
db.Sequelize = Sequelize; // Tambahkan library Sequelize ke object db

module.exports = db;