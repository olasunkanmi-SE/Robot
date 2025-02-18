import { Command } from '../commands';

export interface ICommandExecution {
  execute(command: Command): void;
}
