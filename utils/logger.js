import winston from 'winston';
import LokiTransport from 'winston-loki';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'http',
  format: winston.format.combine(winston.format.errors({ stack: true }), winston.format.timestamp()),
  defaultMeta: { env: process.env.APP_ENV },
  transports: [
    new LokiTransport({
      host: process.env.LOKI_HOST || 'http://localhost:3100',
      labels: { app: 'my-app' },
      format: winston.format.json(),
    }),
  ],
});

// Method to add more default metadata
logger.addDefaultMetadata = (newMeta) => {
  const defaultMetadata = { ...logger.defaultMetadata, ...newMeta };
  logger.defaultMeta = defaultMetadata;
};

export default logger;
