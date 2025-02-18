export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export type Position = { x: number; y: number };

export type Dimension = {
  width: number;
  height: number;
};

export type RobotState = {
  position: Position;
  direction: Direction;
};
