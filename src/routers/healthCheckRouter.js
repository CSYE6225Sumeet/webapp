const express = require('express');
const { healthCheck, methodNotAllowed } = require('../controllers/healthCheckController');

const router = express.Router();

router.get('/healthz', healthCheck);
router.all('/healthz', methodNotAllowed);

module.exports = router;