import { Position } from 'src/interfaces/genericInterface';

export const DEFAULT_TABLE_DIMENSION = {
  width: 5,
  height: 5,
};

export const TABLE_ORIGIN: Position = { x: 0, y: 0 };

export enum DIRECTION {
  NORTH = 'NORTH',
  EAST = 'EAST',
  SOUTH = 'SOUTH',
  WEST = 'WEST',
}
