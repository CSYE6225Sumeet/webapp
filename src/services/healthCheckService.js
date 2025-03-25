const HealthCheck = require('../models/HealthCheck');
const statsd = require('../utils/metrics');
const logger = require('../utils/logger');

const performHealthCheck = async () => {
  const apiStart = Date.now();
  logger.info('Health check initiated');

  try {
    const dbStart = Date.now();
    await HealthCheck.create({});
    const dbDuration = Date.now() - dbStart;

    statsd.timing('db.healthcheck.insert.latency', dbDuration);
    statsd.increment('api.healthcheck.count');
    statsd.timing('api.healthcheck.latency', Date.now() - apiStart);

    logger.info('Health check successful');
  } catch (error) {
    statsd.increment('api.healthcheck.error');
    logger.error('Health check failed', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = { performHealthCheck };
