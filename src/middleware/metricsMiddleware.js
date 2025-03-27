const statsd = require('../utils/metrics');

const metricsMiddleware = (req, res, next) => {
  const method = req.method.toLowerCase();
  const metricKey = `api.${method}`; // Only based on method: GET, POST, etc.

  statsd.increment(`${metricKey}.count`);

  const startTime = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(startTime);
    const responseTime = duration[0] * 1000 + duration[1] / 1e6;
    statsd.timing(`${metricKey}.duration`, responseTime);
    statsd.increment(`${metricKey}.status.${res.statusCode}`);
  });

  req.metricKey = metricKey;
  next();
};

module.exports = metricsMiddleware;
