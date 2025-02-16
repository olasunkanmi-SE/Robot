import { Robot } from "../models/robot";

export interface ICommand {
  execute(robot: Robot): void;
}
