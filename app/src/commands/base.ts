import { ICommand } from '../interfaces/commandInterface';

export abstract class Command implements ICommand {
  abstract execute(): void;
}
