const logger = require('../utils/logger');

const methodRestrictor = {
  badRequest: (req, res) => {
    logger.warn('400 Bad Request', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    });
    res.status(400).send();
  },

  methodNotAllowed: (req, res) => {
    logger.warn('405 Method Not Allowed', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    });
    res.status(405).send();
  }
};

module.exports = methodRestrictor;
