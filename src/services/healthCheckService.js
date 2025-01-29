const HealthCheck = require('../models/HealthCheck');

const performHealthCheck = async () => {
  await HealthCheck.create({});
};

module.exports = { performHealthCheck };