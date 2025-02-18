import { BadRequestException } from '@nestjs/common';
import { Result } from '../application/result';
import { Dimension, Position } from '../interfaces/genericInterface';
import { ITable } from '../interfaces/tableInterface';

export class Table implements ITable {
  private _dimension: Dimension;
  private _origin: Position;

  constructor() {}

  set dimension(dimension: Dimension) {
    this._dimension = dimension;
  }

  set origin(origin: Position) {
    this._origin = origin;
  }

  get dimension(): Dimension {
    return this._dimension;
  }

  get origin(): Position {
    return this._origin;
  }

  /**
   * Checks if a given position is within the bounds of the table.
   * @param position The position to validate.
   * @returns True if the position is valid, false otherwise.
   */
  isValidPosition(position: Position): boolean {
    const { x, y } = position;
    return (
      x >= this.origin.x &&
      x < this.dimension.width + this.origin.x &&
      y >= this.origin.y &&
      y < this.dimension.height + this.origin.y
    );
  }

  /**
   * Creates a new Table instance.  Uses the Result type to handle potential errors during table creation,
   * specifically regarding invalid dimensions.
   * @param dimension The dimensions of the table.
   * @param origin The origin (top-left corner) of the table.
   * @returns A Result object containing the Table instance on success, or an error on failure.
   */
  static create(dimension?: Dimension): Result<Table> {
    try {
      if (dimension) {
        Table.validateDimensions(dimension);
      }
      const table = new Table();
      if (dimension) {
        table._dimension = dimension;
      }
      return Result.ok(table);
    } catch (error) {
      return Result.fail<Table>((error as Error).message);
    }
  }

  static validateDimensions(dimension: Dimension): void {
    if (dimension.height <= 0 || dimension.width <= 0) {
      throw new BadRequestException('Table dimensions must be positive');
    }
  }
}
