import { Injectable, Logger } from '@nestjs/common';
import { IContextAwareLogger } from './loggerInterface';

@Injectable()
export class ApplicationLogger extends Logger implements IContextAwareLogger {
  constructor(context: string, options?: { timestamp?: boolean }) {
    super(context, options);
  }

  debug(message: string): void {
    if (process.env['NODE_ENV'] !== 'production')
      super.debug(`[DEBUG] ${message}`, this.context);
  }

  log(message: string): void {
    super.log(`[INFO] ${message}`, this.context);
  }

  error(message: string, trace?: string): void {
    super.error(`[ERROR] ${message}`, trace, this.context);
  }

  warn(message: string): void {
    super.warn(`[WARN] ${message}`, this.context);
  }

  verbose(message: string): void {
    if (process.env['NODE_ENV'] !== 'production')
      super.verbose(`[VERBOSE] ${message}`, this.context);
  }
}
