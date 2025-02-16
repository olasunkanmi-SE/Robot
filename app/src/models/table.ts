import { Dimension, Direction, Position } from '../interfaces/genericInterface';
import {
  DEFAULT_TABLE_DIMENSION,
  DIRECTION,
  TABLE_ORIGIN,
} from './../constants/constants';
export class Table {
  // A robot that is not on the table can choose to ignore the MOVE, LEFT, RIGHT and REPORT commands.
  constructor(
    private readonly _dimension?: Dimension,
    private readonly _origin?: Position,
  ) {
    this._dimension = _dimension ?? DEFAULT_TABLE_DIMENSION;
    this._origin = _origin ?? TABLE_ORIGIN;
  }

  get dimension() {
    return this._dimension;
  }

  get origin() {
    return this._origin;
  }

  isValidPosition({ x, y }: Position): boolean {
    if (!this.dimension) {
      return false;
    }
    return (
      x >= 0 && x < this.dimension.width && y >= 0 && y < this.dimension.height
    );
  }

  getNextPosition(current: Position, direction: Direction) {
    const movements = {
      [DIRECTION.NORTH]: { x: 0, y: 1 },
      [DIRECTION.SOUTH]: { x: 0, y: -1 },
      [DIRECTION.EAST]: { x: 1, y: 1 },
      [DIRECTION.WEST]: { x: -1, y: 1 },
    };
    const movement = movements[direction];
    return {
      x: current.x + movement.x,
      y: current.y + movement.y,
    };
  }

  private getKey(position: Position): string {
    return `${position.x},${position.y}`;
  }
}
