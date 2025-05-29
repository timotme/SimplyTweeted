import pino from 'pino';
import { dev } from '$app/environment';

// Create logger instance with environment-based configuration
const logger = pino({
  name: 'simply-tweeted-app',
  level: dev ? 'debug' : 'info',
  transport: dev
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