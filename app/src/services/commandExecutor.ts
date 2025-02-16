import { Inject } from '@nestjs/common';
import { Command } from 'src/commands';
import { SERVICE_IDENTIFIER } from 'src/constants/identifiers';
import { IRobot } from 'src/interfaces/robotInterface';

export class CommandExecutor {
  private isPlaced: boolean = false;

  constructor(
    @Inject(SERVICE_IDENTIFIER.IRobot) private readonly robot: IRobot,
  ) {}

  execute(command: Command): void {
    if (!command) return;

    const isPlaceCommand: boolean =
      command instanceof Command && 'position' in command;

    if (!this.isPlaced && !isPlaceCommand) {
      return;
    }

    if (isPlaceCommand) {
      this.isPlaced = this.robot.isPlaced();
    }

    command.execute();
  }
}
