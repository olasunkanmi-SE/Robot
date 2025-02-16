import { Position } from './genericInterface';

export interface ITable {
  isValidPosition(position: Position): boolean;
}
