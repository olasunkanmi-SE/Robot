import { ICommand } from 'src/interfaces/commandInterface';
import { Robot } from 'src/models/robot';

export abstract class BaseCommand implements ICommand {
  abstract execute(robot: Robot): void;
}
