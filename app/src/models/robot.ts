import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_IDENTIFIER } from 'src/constants/identifiers';
import { IContextAwareLogger } from 'src/infrastructure/loggerInterface';
import { IDirectionHandler } from 'src/interfaces/directionInterface';
import { IRobot, RobotState } from 'src/interfaces/robotInterface';
import { Direction, Position } from './../interfaces/genericInterface';
import { Table } from './table';

@Injectable()
export class Robot implements IRobot {
  private position: Position | null;
  private direction: Direction | null;
  private state: RobotState | null = null;
  public table: Table;

  constructor(
    @Inject(SERVICE_IDENTIFIER.IDirectionHandler)
    private readonly directionHandler: IDirectionHandler,
    @Inject(SERVICE_IDENTIFIER.IContextAwareLogger)
    private readonly logger: IContextAwareLogger,
  ) {
    this.table = new Table();
  }

  /**
   * Places the robot on the table at the given position and direction.
   *
   * @param position The position to place the robot at.
   * @param direction The direction to face the robot.
   * @returns `true` if the placement was successful, `false` otherwise.
   * @throws {BadRequestException} If the position or direction is invalid.
   */
  place(position: Position, direction: Direction): boolean {
    if (!this.table.isValidPosition(position)) {
      this.logger.warn(
        'Robot',
        `Invalid position provided: ${JSON.stringify(position)}`,
      );
      return false;
    }

    this.position = { ...position };
    this.direction = direction;

    this.state = { position: this.position, direction: this.direction };

    this.logger.log(
      'Robot.place',
      `Robot placed at ${this.position.x},${this.position.y} facing ${this.direction}`,
    );
    return true;
  }

  /**
   * Moves the robot one unit forward in the direction it is currently facing.
   *
   * @returns `true` if the move was successful, `false` otherwise.
   * @throws {BadRequestException} If the robot has not been placed yet.
   */
  move(): boolean {
    try {
      if (!this.state) {
        this.logger.warn('Robot', 'Robot must be placed before moving.');
        return false;
      }

      if (!this.isPlaced()) {
        this.logger.warn('Robot', 'Robot must be placed before moving.');
        return false;
      }
      // Non-null assertion operator because isPlaced() checks for undefined
      const { x, y } = this.directionHandler.getNextPosition(this.direction!);
      const newPosition: Position = {
        x: this.position!.x + x,
        y: this.position!.y + y,
      };

      if (!this.table.isValidPosition(newPosition)) {
        this.logger.warn(
          'Robot',
          `Move would result in invalid position: ${JSON.stringify(newPosition)}`,
        );
        return false;
      }

      this.position = newPosition;
      this.state = { ...this.state, position: newPosition };
      this.logger.log(
        'Robot',
        `Robot moved to ${this.position.x},${this.position.y}`,
      );
      return true;
    } catch (error: any) {
      this.logger.log('Robot.move', String(error));
      throw new Error(String(error));
    }
  }

  /**
   * Rotates the robot 90 degrees to the left.
   *
   * @returns `true` if the rotation was successful, `false` otherwise.
   * @throws {BadRequestException} If the robot has not been placed yet.
   */
  rotateLeft(): boolean {
    if (!this.isPlaced()) {
      this.logger.warn('Robot', 'Robot must be placed before rotating.');
      return false;
    }
    // Non-null assertion operator because isPlaced() checks for undefined
    this.direction = this.directionHandler.left(this.direction!);
    this.logger.log(
      'Robot.rotateLeft',
      `Robot rotated left, now facing ${this.direction}`,
    );
    this.state = {
      ...this.state,
      direction: this.direction,
      position: this.position,
    };
    return true;
  }

  /**
   * Rotates the robot 90 degrees to the right.
   *
   * @returns `true` if the rotation was successful, `false` otherwise.
   * @throws {BadRequestException} If the robot has not been placed yet.
   */
  rotateRight(): boolean {
    if (!this.isPlaced()) {
      this.logger.warn('Robot', 'Robot must be placed before rotating.');
      return false;
    }
    // Non-null assertion operator because isPlaced() checks for undefined
    this.direction = this.directionHandler.right(this.direction!);
    this.logger.log(
      'Robot.rotateRight',
      `Robot rotated right, now facing ${this.direction}`,
    );
    this.state = {
      ...this.state,
      direction: this.direction,
      position: this.position,
    };
    return true;
  }

  /**
   * Reports the current position and direction of the robot.
   *
   * @returns A string representing the robot's position and direction, or `undefined` if the robot has not been placed yet.
   */
  report(): string | undefined {
    if (!this.isPlaced()) {
      this.logger.warn('Robot', 'Robot must be placed before reporting.');
      return undefined;
    }

    const reportString = `${this.position!.x},${this.position!.y},${this.direction}`; // Non-null assertion operator because isPlaced() checks for undefined
    this.logger.log('Robot.report', `Robot report: ${reportString}`);
    return reportString;
  }

  /**
   * Checks if the robot has been placed on the table.
   *
   * @returns `true` if the robot has been placed, `false` otherwise.
   */
  isPlaced(): boolean {
    return this.position !== undefined && this.direction !== undefined;
  }

  /**
   * Retrieves the current state of the robot.
   *
   * @returns {RobotState | null} The current state of the robot, or null if the state is not set.
   */
  getState(): RobotState | null {
    return this.state;
  }
}
