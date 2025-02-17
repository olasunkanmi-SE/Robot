import { IDirectionHandler } from 'src/interfaces';
import { AppService } from '../app.service';
import { IContextAwareLogger } from '../infrastructure/loggerInterface';
import { IRobot } from '../interfaces/robotInterface';
import { Robot, Table } from '../models';
import { CommandExecutor } from '../services/commandExecutor';
import { CommandParser } from '../services/commandParser';

const logger: jest.Mocked<IContextAwareLogger> = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

const mockDirectionHandler: jest.Mocked<IDirectionHandler> = {
  left: jest.fn(),
  right: jest.fn(),
  getNextPosition: jest.fn(),
};

describe('Robot', () => {
  let table: Table;
  let robot: IRobot;
  let parser: CommandParser;
  let executor: CommandExecutor;
  let appService: AppService;

  beforeEach(() => {
    table = new Table();
    table.dimension = { height: 5, width: 5 };
    table.origin = { x: 0, y: 0 };
    robot = new Robot(mockDirectionHandler, logger);
    robot.table = table;
    parser = new CommandParser(robot, logger);
    executor = new CommandExecutor(robot);
    appService = new AppService(robot, logger);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('', () => {
    test('PLACE 0,0,NORTH -> MOVE -> REPORT', () => {
      const commands = ['PLACE 0,0,NORTH', 'MOVE', 'REPORT'];
      mockDirectionHandler.getNextPosition.mockReturnValue({ x: 0, y: 1 });
      commands.forEach((input) => {
        const command = parser.parse(input);
        executor.execute(command!);
      });
      expect(robot.report()).toEqual('0,1,NORTH');
    });
  });
});
