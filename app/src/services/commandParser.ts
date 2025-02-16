import { Inject } from '@nestjs/common';
import {
  Command,
  LeftCommand,
  MoveCommand,
  PlaceCommand,
  ReportCommand,
  RightCommand,
} from 'src/commands';
import { DIRECTION } from 'src/constants/constants';
import { SERVICE_IDENTIFIER } from 'src/constants/identifiers';
import { IContextAwareLogger } from 'src/infrastructure/loggerInterface';
import { IRobot } from 'src/interfaces/robotInterface';

export class CommandParser {
  constructor(
    @Inject(SERVICE_IDENTIFIER.IRobot) private readonly robot: IRobot,
    @Inject(SERVICE_IDENTIFIER.IContextAwareLogger)
    private readonly logger: IContextAwareLogger,
  ) {}

  parse(input: string): Command | null {
    const trimmedInput = input.trim().toUpperCase();
    if (!trimmedInput) return null;

    const [command, args] = trimmedInput.split(/\s+/);
    try {
      switch (command) {
        case 'PLACE': {
          if (!args) throw new Error('Place command requires arguments');
          const [x, y, direction] = args.split(',');
          const position = {
            x: parseInt(x, 10),
            y: parseInt(y, 10),
          };
          if (isNaN(position.x) || isNaN(position.y))
            throw new Error('Invalid position coordinates');

          if (!Object.values(DIRECTION).includes(direction as DIRECTION))
            throw new Error('Invalid direction');
          return new PlaceCommand(this.robot, position, direction as DIRECTION);
        }
        case 'MOVE':
          return new MoveCommand(this.robot);

        case 'LEFT':
          return new LeftCommand(this.robot);

        case 'RIGHT':
          return new RightCommand(this.robot);
        case 'REPORT':
          return new ReportCommand(this.robot, this.logger);
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      this.logger.error('CommandParser', `Error: ${(error as Error).message}`);
      return null;
    }
  }
}
