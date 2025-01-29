const rejectPayloads = (req, res, next) => {

    res.removeHeader('Connection');
    res.removeHeader('Keep-Alive');

    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
  
    req.on('end', () => {
      if (data.length > 0) {
        res.status(400).send(); // 400 Bad Request
      } else {
        next();
      }
    });
  };
  
  const rejectQueryParams = (req, res, next) => {
    if (Object.keys(req.query).length > 0) {
      res.status(400).send(); // 400 Bad Request
    } else {
      next();
    }
  };
  
  const setCommonHeaders = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  };
  
  module.exports = { rejectPayloads, rejectQueryParams, setCommonHeaders };