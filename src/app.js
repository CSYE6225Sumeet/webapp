const express = require('express');
const sequelize = require('./config/database');
const { rejectPayloads, rejectQueryParams, setCommonHeaders } = require('./middleware');
const healthCheckRouter = require('./routers/healthCheckRouter');

const app = express();

app.disable('x-powered-by');

// Synchronize Sequelize models
sequelize
  .sync()
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
  });

// Middleware
app.use(rejectPayloads);
app.use(rejectQueryParams);
app.use(setCommonHeaders);

// Routes
app.use(healthCheckRouter);

// Start the server
const server = app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});

module.exports = { app, server };