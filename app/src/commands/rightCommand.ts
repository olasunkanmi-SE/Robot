import { SERVICE_IDENTIFIER } from 'src/constants/identifiers';
import { Command } from './base';
import { Inject } from '@nestjs/common';
import { IRobot } from 'src/interfaces/robotInterface';

export class RightCommand extends Command {
  constructor(
    @Inject(SERVICE_IDENTIFIER.IRobot) private readonly robot: IRobot,
  ) {
    super();
  }

  execute(): void {
    this.robot.rotateRight();
  }
}
