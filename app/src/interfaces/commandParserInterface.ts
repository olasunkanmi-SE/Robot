import { Command } from 'src/commands';

export interface ICommandParser {
  parse(input: string): Command | null;
}
