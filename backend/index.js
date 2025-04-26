// backend/index.js
require('dotenv').config();   // ← MUST come BEFORE any other requires

const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;
sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error', err));
