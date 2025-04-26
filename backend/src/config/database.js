// backend/src/config/database.js
require('dotenv').config();   // ← ensures env is loaded even if imported directly

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,    // now “crm”
  process.env.DB_USER,    // “anabilmacintosh”
  process.env.DB_PASS,    // “” (empty string)
  {
    host: process.env.DB_HOST,  // “localhost”
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
