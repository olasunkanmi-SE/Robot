import { ICommand } from 'src/interfaces/commandInterface';

export abstract class Command implements ICommand {
  abstract execute(): void;
}
