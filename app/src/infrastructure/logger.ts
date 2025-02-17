import { Injectable, Logger } from '@nestjs/common';
import { IContextAwareLogger } from './loggerInterface';

@Injectable()
export class ApplicationLogger extends Logger implements IContextAwareLogger {
  constructor(context: string, options?: { timestamp?: boolean }) {
    super(context, options);
  }

  debug(context: string, message: string): void {
    if (process.env['NODE_ENV'] !== 'production')
      super.debug(`[DEBUG] ${message}`, context);
  }

  log(context: string, message: string): void {
    super.log(`[INFO] ${message}`, context);
  }

  error(message: string, trace?: string): void {
    super.error(`[ERROR] ${message}`, trace, this.context);
  }

  warn(context: string, message: string): void {
    super.warn(`[WARN] ${message}`, context);
  }

  verbose(context: string, message: string): void {
    if (process.env['NODE_ENV'] !== 'production')
      super.verbose(`[VERBOSE] ${message}`, context);
  }
}
