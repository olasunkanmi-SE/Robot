/* eslint-disable @typescript-eslint/unbound-method */
import { DIRECTION } from '../../constants/constants';
import {
  LeftCommand,
  MoveCommand,
  PlaceCommand,
  ReportCommand,
  RightCommand,
} from '../../commands';
import { IContextAwareLogger } from '../../infrastructure/loggerInterface';
import { IRobot } from '../../interfaces/robotInterface';
import { Table } from '../../models';
import { CommandParser } from '../../services/commandParser';

describe('CommandParder', () => {
  let commandParser: CommandParser;
  let robot: IRobot;
  let table: Table;
  let logger: IContextAwareLogger;

  beforeEach(() => {
    table = new Table();
    table.dimension = { height: 5, width: 5 };
    table.origin = { x: 0, y: 0 };
    robot = {
      place: jest.fn(),
      move: jest.fn(),
      rotateLeft: jest.fn(),
      rotateRight: jest.fn(),
      report: jest.fn(),
      isPlaced: jest.fn().mockReturnValue(true),
      table: table,
    };

    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };
    commandParser = new CommandParser(robot, logger);
  });

  it('should parse PLACE command correctly', () => {
    const input = 'PLACE 1,2,NORTH';
    const command = commandParser.parse(input);
    expect(command).toBeInstanceOf(PlaceCommand);
    expect((command as PlaceCommand)['position']).toEqual({ x: 1, y: 2 });
    expect((command as PlaceCommand)['direction']).toEqual(DIRECTION.NORTH);
  });

  it('should parse MOVE command correctly', () => {
    const input = 'MOVE';
    const command = commandParser.parse(input);
    expect(command).toBeInstanceOf(MoveCommand);
  });

  it('should parse LEFT command correctly', () => {
    const input = 'LEFT';
    const command = commandParser.parse(input);
    expect(command).toBeInstanceOf(LeftCommand);
  });

  it('should parse RIGHT command correctly', () => {
    const input = 'RIGHT';
    const command = commandParser.parse(input);
    expect(command).toBeInstanceOf(RightCommand);
  });

  it('should parse REPORT command correctly', () => {
    const input = 'REPORT';
    const command = commandParser.parse(input);
    expect(command).toBeInstanceOf(ReportCommand);
  });

  it('should return null for empty input', () => {
    const input = '';
    const command = commandParser.parse(input);
    expect(command).toBeNull();
  });

  it('should return null for invalid command', () => {
    const input = 'INVALID_COMMAND';
    const command = commandParser.parse(input);
    expect(command).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      'CommandParser.parse',
      'Error: Unknown command: INVALID_COMMAND',
    );
  });

  it('should return null for invalid PLACE command arguments', () => {
    const input = 'PLACE 1,2';
    const command = commandParser.parse(input);
    expect(command).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      'CommandParser.parse',
      'Error: Invalid direction',
    );
  });

  it('should return null for invalid PLACE coordinates', () => {
    const input = 'PLACE A,B,NORTH';
    const command = commandParser.parse(input);
    expect(command).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      'CommandParser.parse',
      'Error: Invalid position coordinates',
    );
  });

  it('should return null for invalid PLACE direction', () => {
    const input = 'PLACE 1,2,INVALID_DIRECTION';
    const command = commandParser.parse(input);
    expect(command).toBeNull();
    expect(logger.error).toHaveBeenCalledWith(
      'CommandParser.parse',
      'Error: Invalid direction',
    );
  });

  it('should handle case-insensitive commands', () => {
    const input = 'place 1,2,north';
    const command = commandParser.parse(input);
    expect(command).toBeInstanceOf(PlaceCommand);
    expect((command as PlaceCommand)['position']).toEqual({ x: 1, y: 2 });
    expect((command as PlaceCommand)['direction']).toEqual(DIRECTION.NORTH);
  });

  it('should handle extra spaces in command', () => {
    const input = '  PLACE   1,2,NORTH  ';
    const command = commandParser.parse(input);
    expect(command).toBeInstanceOf(PlaceCommand);
    expect((command as PlaceCommand)['position']).toEqual({ x: 1, y: 2 });
    expect((command as PlaceCommand)['direction']).toEqual(DIRECTION.NORTH);
  });
});
