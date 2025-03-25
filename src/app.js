const express = require('express');
const sequelize = require('./config/database');
const { rejectPayloads, rejectQueryParams, setCommonHeaders } = require('./middleware');
const healthCheckRouter = require('./routers/healthCheckRouter');
const imagerouter = require('./routers/fileRouter');

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
// app.use(rejectPayloads);
// app.use(rejectQueryParams);
app.use(setCommonHeaders);
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/healthz', rejectPayloads, rejectQueryParams, healthCheckRouter);
// app.use(healthCheckRouter);
app.use('/v1/file', imagerouter);

// Start the server
const server = app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});

module.exports = { app, server };