const healthCheckService = require('../services/healthCheckService');
const logger = require('../utils/logger');

const healthCheck = async (req, res) => {
  try {
    logger.info('Health check endpoint called');
    await healthCheckService.performHealthCheck();
    logger.info('Health check successful');
    res.status(200).send();
  } catch (error) {
    logger.error('Health check failed', { error: error.message, stack: error.stack });
    res.status(503).send();
  }
};

const methodNotAllowed = (req, res) => {
  logger.warn(`Method not allowed on health check route: ${req.method}`);
  res.status(405).send();
};

module.exports = { healthCheck, methodNotAllowed };
