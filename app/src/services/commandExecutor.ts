import { Inject } from '@nestjs/common';
import { Command } from '../commands';
import { SERVICE_IDENTIFIER } from '../constants/identifiers';
import { IRobot } from '../interfaces/robotInterface';
import { ICommandExecution } from 'src/interfaces/commandExecutorInterface';

export class CommandExecutor implements ICommandExecution {
  private isPlaced: boolean = false;

  constructor(
    @Inject(SERVICE_IDENTIFIER.IRobot) private readonly robot: IRobot,
  ) {}

  get placed() {
    return this.isPlaced;
  }

  execute(command: Command): void {
    if (!command) return;
    const isPlaceCommand: boolean =
      command instanceof Command && 'position' in command;
    if (isPlaceCommand) {
      this.isPlaced = this.robot.isPlaced();
    }
    command.execute();
  }
}
