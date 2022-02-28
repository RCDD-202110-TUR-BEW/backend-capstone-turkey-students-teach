const winston = require('winston');
const path = require('path');

const logDirectory = path.join(process.cwd(), '/logs');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.align(),
    winston.format.printf(
      (info) =>
        `[${info.level.toUpperCase()}] ${[info.timestamp]}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, 'errors.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, 'warns_errors.log'),
      level: 'warn',
    }),
    new winston.transports.File({
      filename: path.join(logDirectory, 'all.log'),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

module.exports = logger;
