import { Direction, Position } from './genericInterface';

export interface IDirectionHandler {
  left(currentDirection: Direction): Direction;
  right(currentDirection: Direction): Direction;
  getNextPosition(direction: Direction): Position;
}
