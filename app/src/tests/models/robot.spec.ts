/* eslint-disable @typescript-eslint/unbound-method */
import { IContextAwareLogger } from '../../infrastructure/loggerInterface';
import { Direction, IDirectionHandler, Position } from '../../interfaces';
import { Robot, Table } from '../../models';

const mockDirectionHandler: jest.Mocked<IDirectionHandler> = {
  left: jest.fn(),
  right: jest.fn(),
  getNextPosition: jest.fn(),
};

const mockLogger: jest.Mocked<IContextAwareLogger> = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

describe('Robot', () => {
  let table: Table;
  let robot: Robot;

  beforeEach(() => {
    table = new Table();
    table.dimension = { height: 5, width: 5 };
    table.origin = { x: 0, y: 0 };
    robot = new Robot(mockDirectionHandler, mockLogger);
    robot.table = table;
  });

  it('should be defined', () => {
    expect(robot).toBeDefined();
  });

  describe('place', () => {
    it('Should place the robot on the table successfully with valid position and direction', () => {
      const position: Position = { x: 1, y: 2 };
      const direction: Direction = 'NORTH';
      const result = robot.place(position, direction);
      expect(result).toBe(true);
      expect(robot['position']).toEqual(position);
      expect(robot['direction']).toBe(direction);
      expect(robot.getState()).toEqual({ position, direction });
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Robot.place',
        'Robot placed at 1,2 facing NORTH',
      );
    });

    it('should not place the robot when given an invalid position', () => {
      jest.spyOn(robot.table, 'isValidPosition').mockReturnValue(false);

      const position: Position = { x: -1, y: -1 };
      const direction: Direction = 'NORTH';
      const result = robot.place(position, direction);
      expect(result).toBe(false);
      expect(robot.getState()).toBeNull();
    });
  });

  describe('move', () => {
    it('should move the robot successfully when placed and given a valid move', () => {
      const intialPosition: Position = { x: 1, y: 2 };
      const direction: Direction = 'EAST';
      robot.place(intialPosition, direction);
      mockDirectionHandler.getNextPosition.mockReturnValue({ x: 1, y: 0 });

      const result = robot.move();
      expect(result).toBe(true);
      expect(robot['position']).toEqual({ x: 2, y: 2 });
      expect(robot.getState()!.position).toEqual({ x: 2, y: 2 });
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Robot.move',
        'Robot moved to 2,2',
      );
    });

    it('should not move the robot if it has not been placed', () => {
      const result = robot.move();

      expect(result).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Robot',
        'Robot must be placed before moving.',
      );
    });

    it('should not move the robot if the move results in an invalid position', () => {
      const initialPosition: Position = { x: 4, y: 4 };
      const direction: Direction = 'NORTH';
      robot.place(initialPosition, direction);

      mockDirectionHandler.getNextPosition.mockReturnValue({ x: 0, y: 1 });

      const result = robot.move();

      expect(result).toBe(false);
      expect(robot['position']).toEqual({ x: 4, y: 4 });
      expect(robot.getState()!.position).toEqual({ x: 4, y: 4 });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Robot.move',
        'Move would result in invalid position: {"x":4,"y":5}',
      );
    });

    it('should handle errors during move', () => {
      const initialPosition: Position = { x: 0, y: 0 };
      const direction: Direction = 'NORTH';
      robot.place(initialPosition, direction);

      mockDirectionHandler.getNextPosition.mockImplementation(() => {
        throw new Error('Simulated error');
      });

      expect(() => robot.move()).toThrow('Simulated error');
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Robot.move',
        'Error: Simulated error',
      );
    });
  });

  describe('rotateLeft', () => {
    it('should rotate the robot left successfully when placed', () => {
      const initialPosition: Position = { x: 0, y: 0 };
      const initialDirection: Direction = 'NORTH';
      robot.place(initialPosition, initialDirection);
      const newDirection: Direction = 'WEST';
      mockDirectionHandler.left.mockReturnValue(newDirection);
      const result = robot.rotateLeft();
      expect(result).toBe(true);
      expect(robot['direction']).toBe(newDirection);
      expect(robot.getState()!.direction).toBe(newDirection);
      expect(mockDirectionHandler.left).toHaveBeenCalledWith(initialDirection);
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Robot.rotateLeft',
        'Robot rotated left, now facing WEST',
      );
    });

    it('should not rotate the robot left if it has not been placed', () => {
      const result = robot.rotateLeft();

      expect(result).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Robot.rotateLeft',
        'Robot must be placed before rotating.',
      );
    });
  });

  describe('rotateRight', () => {
    it('should rotate the robot right successfully when placed', () => {
      const initialPosition: Position = { x: 0, y: 0 };
      const initialDirection: Direction = 'NORTH';
      robot.place(initialPosition, initialDirection);

      const newDirection: Direction = 'EAST';
      mockDirectionHandler.right.mockReturnValue(newDirection);

      const result = robot.rotateRight();

      expect(result).toBe(true);
      expect(robot['direction']).toBe(newDirection);
      expect(robot.getState()!.direction).toBe(newDirection);
      expect(mockDirectionHandler.right).toHaveBeenCalledWith(initialDirection);
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Robot.rotateRight',
        'Robot rotated right, now facing EAST',
      );
    });

    it('should not rotate the robot right if it has not been placed', () => {
      const result = robot.rotateRight();

      expect(result).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Robot',
        'Robot must be placed before rotating.',
      );
    });
  });

  describe('report', () => {
    it('should report the current position and direction of the robot when placed', () => {
      const position: Position = { x: 1, y: 2 };
      const direction: Direction = 'SOUTH';
      robot.place(position, direction);

      const reportString = robot.report();

      expect(reportString).toBe('1,2,SOUTH');
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Robot.report',
        'Robot report: 1,2,SOUTH',
      );
    });

    it('should not report if the robot has not been placed', () => {
      const reportString = robot.report();

      expect(reportString).toBeUndefined();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Robot',
        'Robot must be placed before reporting.',
      );
    });
  });

  describe('report', () => {
    it('should report the current position and direction of the robot when placed', () => {
      const position: Position = { x: 1, y: 2 };
      const direction: Direction = 'SOUTH';
      robot.place(position, direction);

      const reportString = robot.report();

      expect(reportString).toBe('1,2,SOUTH');
      expect(mockLogger.log).toHaveBeenCalledWith(
        'Robot.report',
        'Robot report: 1,2,SOUTH',
      );
    });

    it('should not report if the robot has not been placed', () => {
      const reportString = robot.report();

      expect(reportString).toBeUndefined();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Robot',
        'Robot must be placed before reporting.',
      );
    });
  });

  describe('isPlaced', () => {
    it('should return true if the robot has been placed', () => {
      robot.place({ x: 0, y: 0 }, 'NORTH');
      expect(robot.isPlaced()).toBe(true);
    });

    it('should return false if the robot has not been placed', () => {
      expect(robot.isPlaced()).toBe(false);
    });
  });

  describe('getState', () => {
    it('should return the current state of the robot when placed', () => {
      const position: Position = { x: 3, y: 4 };
      const direction: Direction = 'EAST';
      robot.place(position, direction);

      const state = robot.getState();

      expect(state).toEqual({ position: position, direction: direction });
    });

    it('should return null if the robot has not been placed', () => {
      const state = robot.getState();
      expect(state).toBeNull();
    });
  });
});
