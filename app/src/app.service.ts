import { Inject } from '@nestjs/common';
import * as readline from 'readline';
import { SERVICE_IDENTIFIER } from './constants/identifiers';
import { IContextAwareLogger } from './infrastructure/loggerInterface';
import { IRobot } from './interfaces/robotInterface';
import { Table } from './models';
import { CommandExecutor } from './services/commandExecutor';
import { CommandParser } from './services/commandParser';

export class AppService {
  private readonly table: Table;
  private readonly parser: CommandParser;
  private readonly executor: CommandExecutor;
  private readonly rl: readline.Interface;

  constructor(
    @Inject(SERVICE_IDENTIFIER.IRobot) private readonly robot: IRobot,
    @Inject(SERVICE_IDENTIFIER.IContextAwareLogger)
    private readonly logger: IContextAwareLogger,
  ) {
    this.table = new Table();
    this.table.dimension = { width: 5, height: 5 };
    this.parser = new CommandParser(this.robot, this.logger);
    this.executor = new CommandExecutor(this.robot);

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  start(): void {
    console.log('Toy Robot Simulator');
    console.log('Enter commands (type "EXIT" to quit):');

    this.rl.on('line', (input: string) => {
      if (input.trim().toUpperCase() === 'EXIT') {
        this.rl.close();
        return;
      }

      try {
        const command = this.parser.parse(input);
        if (command) {
          this.executor.execute(command);
        }
      } catch (error) {
        console.error(`Error processing command: ${error}`);
      }
    });

    this.rl.on('close', () => {
      console.log('Application terminated.');
      process.exit(0);
    });
  }
}
