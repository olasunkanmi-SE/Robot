import { IRobot } from 'src/interfaces/robotInterface';
import { CommandExecutor } from '../../services/commandExecutor';
import { Test, TestingModule } from '@nestjs/testing';
import { SERVICE_IDENTIFIER } from '../../constants/identifiers';
import { Command } from '../../commands';

describe('CommandExecutor', () => {
  let commandExecutor: CommandExecutor;
  let robot: IRobot;

  beforeEach(async () => {
    const mockRobot = {
      place: jest.fn(),
      move: jest.fn(),
      rotateLeft: jest.fn(),
      rotateRight: jest.fn(),
      report: jest.fn(),
      isPlaced: jest.fn().mockReturnValue(false),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandExecutor,
        {
          provide: SERVICE_IDENTIFIER.IRobot,
          useValue: mockRobot,
        },
      ],
    }).compile();

    commandExecutor = module.get<CommandExecutor>(CommandExecutor);
    robot = module.get<IRobot>(SERVICE_IDENTIFIER.IRobot);
  });

  it('should be defined', () => {
    expect(commandExecutor).toBeDefined();
  });

  describe('execute', () => {
    it('should execute a command', () => {
      const mockCommand = { execute: jest.fn() };
      commandExecutor.execute(mockCommand as Command);
      expect(mockCommand.execute).toHaveBeenCalled();
    });

    it('should set isPlaced to true if the robot is already placed, before executing the command', () => {
      // Simulate the robot already being placed
      (robot.isPlaced as jest.Mock).mockReturnValue(true);
      const mockCommand = {
        execute: jest.fn(),
        position: { x: 0, y: 0, facing: 'NORTH' },
        direction: 'NORTH',
      }; // Mimic a "place command"
      commandExecutor.execute(mockCommand as Command);
      expect(commandExecutor.placed).toBe(false); // the isPlaced boolean should be false at the beginning.
      expect(mockCommand.execute).toHaveBeenCalled();
    });

    it('should not change isPlaced if the command is not a place command', () => {
      // Simulate the robot already being placed
      (robot.isPlaced as jest.Mock).mockReturnValue(true);
      commandExecutor['isPlaced'] = false; // Ensure isPlaced starts as false
      const mockCommand = { execute: jest.fn() }; // Not a place command
      commandExecutor.execute(mockCommand as Command);
      expect(commandExecutor.placed).toBe(false); // Should remain false
      expect(mockCommand.execute).toHaveBeenCalled();
    });
  });

  describe('placed getter', () => {
    it('should return the value of the isPlaced flag', () => {
      commandExecutor['isPlaced'] = true;
      expect(commandExecutor.placed).toBe(true);

      commandExecutor['isPlaced'] = false;
      expect(commandExecutor.placed).toBe(false);
    });
  });
});
