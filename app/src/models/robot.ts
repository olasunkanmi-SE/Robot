import { Inject, Injectable } from '@nestjs/common';
import { SERVICE_IDENTIFIER } from 'src/constants/identifiers';
import { IContextAwareLogger } from 'src/infrastructure/loggerInterface';
import { IDirectionHandler } from 'src/interfaces/directionInterface';
import { IRobot, RobotState } from 'src/interfaces/robotInterface';
import { Direction, Position } from './../interfaces/genericInterface';
import { ITable } from 'src/interfaces/tableInterface';

@Injectable()
export class Robot implements IRobot {
  private position: Position | null;
  private direction: Direction | null;
  private state: RobotState | null = null;

  constructor(
    @Inject(SERVICE_IDENTIFIER.IDirectionHandler)
    private readonly directionHandler: IDirectionHandler,
    @Inject(SERVICE_IDENTIFIER.IContextAwareLogger)
    private readonly logger: IContextAwareLogger,
    @Inject(SERVICE_IDENTIFIER.ITable) private readonly table: ITable,
  ) {}

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
      'Robot',
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
    if (!this.state) return false;

    if (!this.isPlaced()) {
      this.logger.warn('Robot', 'Robot must be placed before moving.');
      return false;
    }

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

    this.direction = this.directionHandler.left(this.direction!);
    this.logger.log(
      'Robot',
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

    this.direction = this.directionHandler.right(this.direction!); // Non-null assertion operator because isPlaced() checks for undefined
    this.logger.log(
      'Robot',
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
    this.logger.log('Robot', `Robot report: ${reportString}`);
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

  getState(): RobotState | null {
    return this.state;
  }

  /**
   * Validates the command.  Currently a placeholder.  Can be expanded to validate command sequences.
   */
  commandValidation(): void {
    // Place must always come first - Implementation can be added here.
  }
}
