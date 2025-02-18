import { Injectable } from '@nestjs/common';
import { Result } from '../application/result';
import { DIRECTION, TURN } from '../constants/constants';
import { IDirectionHandler } from '../interfaces/directionInterface';
import { Direction, Position } from '../interfaces/genericInterface';

/**
 * Handles direction rotations based on predefined turns.
 */
@Injectable()
export class DirectionHandler implements IDirectionHandler {
  private readonly directionSequence: Direction[] = Object.values(DIRECTION);

  /**
   * Rotates the current direction by a specified number of turns.
   *
   * @param currentDirection The current direction.
   * @param step The number of turns to rotate. Positive for clockwise, negative for counter-clockwise.
   * @returns The new direction after rotation.
   */
  private rotateDirection(
    currentDirection: Direction,
    step: number,
  ): Direction {
    const currentIndex = this.directionSequence.indexOf(currentDirection);
    if (currentIndex === -1) {
      throw new Error(`Invalid direction: ${currentDirection}`);
    }

    const newIndex =
      (currentIndex + step + this.directionSequence.length) %
      this.directionSequence.length;
    return this.directionSequence[newIndex];
  }

  /**
   * Rotates the current direction to the left (counter-clockwise).
   *
   * @param currentDirection The current direction.
   * @returns The new direction after rotating left.
   */
  left(currentDirection: Direction): Direction {
    return this.rotateDirection(currentDirection, TURN.LEFT);
  }

  /**
   * Rotates the current direction to the right (clockwise).
   *
   * @param currentDirection The current direction.
   * @returns The new direction after rotating right.
   */
  right(currentDirection: Direction): Direction {
    return this.rotateDirection(currentDirection, TURN.RIGHT);
  }

  /**
   * Calculates the next position based on the given direction.
   *
   * @param {Direction} direction - The direction to move in.
   * @returns {Position} The new position after moving in the given direction.
   * @throws {Error} If the direction is invalid.
   */
  getNextPosition(direction: Direction): Position {
    switch (direction) {
      case DIRECTION.NORTH:
        return { x: 0, y: 1 };
      case DIRECTION.SOUTH:
        return { x: 0, y: -1 };
      case DIRECTION.EAST:
        return { x: 1, y: 0 };
      case DIRECTION.WEST:
        return { x: -1, y: 0 };
      default:
        throw new Error(`Invalid dirextion: ${direction}`);
    }
  }

  static create(): Result<DirectionHandler> {
    try {
      const direction = new DirectionHandler();
      return Result.ok(direction);
    } catch (error) {
      return Result.fail<DirectionHandler>((error as Error).message);
    }
  }
}
