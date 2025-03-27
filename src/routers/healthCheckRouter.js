const express = require('express');
const { healthCheck, methodNotAllowed } = require('../controllers/healthCheckController');
const metricsMiddleware = require('../middleware/metricsMiddleware');


const router = express.Router();
router.use(metricsMiddleware);

router.head('/', methodNotAllowed); //Explicitly block head
router.get('/', healthCheck);
router.all('/', methodNotAllowed);

module.exports = router;