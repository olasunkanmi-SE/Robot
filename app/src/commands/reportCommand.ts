import { Inject } from '@nestjs/common';
import { SERVICE_IDENTIFIER } from '../constants/identifiers';
import { IContextAwareLogger } from '../infrastructure/loggerInterface';
import { Command } from './base';
import { IRobot } from '../interfaces/robotInterface';

export class ReportCommand extends Command {
  constructor(
    @Inject(SERVICE_IDENTIFIER.IRobot) private readonly robot: IRobot,
    @Inject(SERVICE_IDENTIFIER.IContextAwareLogger)
    private readonly logger: IContextAwareLogger,
  ) {
    super();
  }

  execute(): void {
    const report = this.robot.report();
    if (report) this.logger.log('ReportCommand', report);
  }
}
