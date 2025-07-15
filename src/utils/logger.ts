import winston from "winston";
import LokiTransport from "winston-loki";

const lokiTransport = new LokiTransport({
  useWinstonMetaAsLabels: true,
  host: process.env.LOKI_HOST || "http://localhost:4566",
  json: true,
  basicAuth: `${process.env.LOKI_USER}:${process.env.LOKI_PASSWORD}`,
  onConnectionError: (err) => {
    console.log("Error connecting to Loki:", err);
  },
  timeout: 5000,
  batching: false,
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),

  transports: [
    lokiTransport,
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
  exceptionHandlers: [
    lokiTransport,
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
  rejectionHandlers: [
    lokiTransport,
    new winston.transports.Console({ handleRejections: true }),
  ],
});
