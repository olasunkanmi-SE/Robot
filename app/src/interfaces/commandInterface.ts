import { Direction } from 'readline';
import { Position } from './genericInterface';
import { Robot } from '../models';

export interface ICommand {
  execute(): void;
}

export interface IcreateCommand {
  robot: Robot;
  position?: Position;
  direction?: Direction;
}
