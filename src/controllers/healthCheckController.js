const healthCheckService = require('../services/healthCheckService');

const healthCheck = async (req, res) => {
  try {
    await healthCheckService.performHealthCheck();
    res.status(200).send();
  } catch (error) {
    res.status(503).send();
  }
};

const methodNotAllowed = (req, res) => {
  res.status(405).send(); // 405 Method Not Allowed
};

module.exports = { healthCheck, methodNotAllowed };