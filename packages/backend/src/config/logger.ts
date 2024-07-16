import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), format.errors({ stack: true }), prettyPrint()),
  transports: [
    new transports.DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      filename: '%DATE%-error.log',
      dirname: 'logs',
      maxSize: '20m',
      maxFiles: '30d',
    }),
    new transports.DailyRotateFile({
      datePattern: 'YYYY-MM-DD',
      filename: '%DATE%.log',
      dirname: 'logs',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      level: 'debug',
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;
