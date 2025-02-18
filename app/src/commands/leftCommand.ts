import { SERVICE_IDENTIFIER } from '../constants/identifiers';
import { Command } from './base';
import { Inject } from '@nestjs/common';
import { IRobot } from '../interfaces/robotInterface';

export class LeftCommand extends Command {
  constructor(
    @Inject(SERVICE_IDENTIFIER.IRobot) private readonly robot: IRobot,
  ) {
    super();
  }

  execute(): void {
    this.robot.rotateLeft();
  }
}
