import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

// Create logger instance with environment-based configuration for server-side use
const logger = pino({
  name: 'simply-tweeted-app-server',
  level: isDevelopment ? 'debug' : 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname'
        }
      }
    : undefined,
  // In production, use structured JSON logging
  formatters: {
    level: (label) => ({ level: label }),
    log: (object) => ({ ...object })
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`
});

export default logger;

// Export convenience methods
export const log = {
  debug: (message: string, extra?: object) => logger.debug(extra, message),
  info: (message: string, extra?: object) => logger.info(extra, message),
  warn: (message: string, extra?: object) => logger.warn(extra, message),
  error: (message: string, extra?: object) => logger.error(extra, message),
  fatal: (message: string, extra?: object) => logger.fatal(extra, message)
}; 