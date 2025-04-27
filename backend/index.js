require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/auth');
const customerRoutes = require('./src/routes/customers');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 4000;
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
});