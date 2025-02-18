import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as readline from 'readline';
import { SERVICE_IDENTIFIER } from './constants/identifiers';
import { IContextAwareLogger } from './infrastructure/loggerInterface';
import { IRobot } from './interfaces/robotInterface';
import { Table } from './models';
import { CommandExecutor } from './services/commandExecutor';
import { CommandParser } from './services/commandParser';
import { Result } from './application/result';
import {
  TABLE_DEFAULT_TABLE_DIMENSION,
  TABLE_ORIGIN,
} from './constants/constants';

@Injectable()
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
    this.table = this.initializeTable(TABLE_DEFAULT_TABLE_DIMENSION);
    this.robot.table = this.table;
    this.parser = new CommandParser(this.robot, this.logger);
    this.executor = new CommandExecutor(this.robot);

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private initializeTable(dimension: { width: number; height: number }): Table {
    try {
      const tableResult = Table.create(dimension);

      if (!tableResult.isSuccess) {
        Result.fail('Table initialization failed');
        throw new BadRequestException('Failed to initialize the table.');
      }

      const table = tableResult.getValue();
      // Non-null assertion operator because tableResult.isSuccess checks for failure
      table!.origin = TABLE_ORIGIN;
      return table!;
    } catch (error) {
      this.logger.error('AppService.initializeTable', String(error));
      throw new Error(String(error));
    }
  }

  start(): void {
    this.logger.log('AppService', 'Toy Robot Simulator started');
    console.log('Toy Robot Simulator');
    console.log('Enter commands (type "EXIT" to quit):');

    this.rl.on('line', (input: string) => {
      this.processCommand(input);
    });

    this.rl.on('close', () => {
      console.log('Application terminated.');
      this.logger.log('AppService', 'Application terminated.');
      process.exit(0);
    });
  }

  private processCommand(input: string): void {
    const command = input.trim().toUpperCase();

    if (command === 'EXIT') {
      this.rl.close();
      return;
    }

    try {
      const parsedCommand = this.parser.parse(input);
      if (parsedCommand) {
        this.executor.execute(parsedCommand);
      }
    } catch (error) {
      this.logger.error('Command processing error', String(error));
      throw new Error(String(error));
    }
  }
}
