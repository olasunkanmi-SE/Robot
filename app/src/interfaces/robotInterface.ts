import { Table } from '../models';
import { Direction, Position } from './genericInterface';

export interface IRobot {
  place(position: Position, direction: Direction): boolean;
  move(): boolean;
  rotateLeft(): boolean;
  rotateRight(): boolean;
  report(): string | undefined;
  isPlaced(): boolean;
  table: Table;
}

export type RobotState = {
  position: Position | null;
  direction: Direction | null;
};
