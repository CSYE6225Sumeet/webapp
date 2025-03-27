const logger = require('../utils/logger');

//Reject requests with payloads (for GET, DELETE etc.)
const rejectPayloads = (req, res, next) => {
  res.removeHeader('Connection');
  res.removeHeader('Keep-Alive');

  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    if (data.length > 0) {
      logger.warn(`Payload rejected for ${req.method} ${req.originalUrl}`);
      res.status(400).send(); // 400 Bad Request
    } else {
      logger.info(`No payload detected for ${req.method} ${req.originalUrl}`);
      next();
    }
  });
};

//Reject requests with query parameters
const rejectQueryParams = (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    logger.warn(`Query parameters rejected for ${req.method} ${req.originalUrl}: ${JSON.stringify(req.query)}`);
    res.status(400).send(); // 400 Bad Request
  } else {
    logger.info(`No query parameters detected for ${req.method} ${req.originalUrl}`);
    next();
  }
};

//Set standard security and cache-control headers
const setCommonHeaders = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  logger.info(`Common headers set for ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = { rejectPayloads, rejectQueryParams, setCommonHeaders };
