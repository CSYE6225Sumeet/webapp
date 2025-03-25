const winston = require('winston');
require('dotenv').config();

const logFilePath = process.env.LOG_FILE_PATH || '/opt/webapp/logs/csye6225.log';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
//   transports: [
//     new winston.transports.Console()
//   ],
  transports: [
    new winston.transports.File({
      filename: logFilePath,
      level: 'info',
      handleExceptions: true,
    })
  ],
  exitOnError: false
});

module.exports = logger;
