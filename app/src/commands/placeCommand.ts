import { Inject } from '@nestjs/common';
import { SERVICE_IDENTIFIER } from 'src/constants/identifiers';
import { Direction, Position } from 'src/interfaces/genericInterface';
import { IRobot } from 'src/interfaces/robotInterface';
import { Command } from './base';

export class PlaceCommand extends Command {
  constructor(
    @Inject(SERVICE_IDENTIFIER.IRobot) private readonly robot: IRobot,
    private readonly position: Position,
    private readonly direction: Direction,
  ) {
    super();
  }

  execute(): void {
    this.robot.place(this.position, this.direction);
  }
}
