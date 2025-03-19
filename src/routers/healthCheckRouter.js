const express = require('express');
const { healthCheck, methodNotAllowed } = require('../controllers/healthCheckController');

const router = express.Router();

router.head('/', methodNotAllowed); //Explicitly block head
router.get('/', healthCheck);
router.all('/', methodNotAllowed);

module.exports = router;