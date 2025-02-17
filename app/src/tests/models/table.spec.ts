import { Result } from 'src/application/result';
import { Position } from '../../interfaces/genericInterface';
import { Table } from '../../models';

describe('Table', () => {
  let table: Table;

  beforeEach(() => {
    table = new Table();
    table.dimension = { height: 5, width: 5 };
    table.origin = { x: 0, y: 0 };
  });

  describe('isValidPosition', () => {
    it('Should return true is the position is valid within the table', () => {
      const position: Position = { x: 1, y: 2 };
      const result = table.isValidPosition(position);
      expect(result).toBe(true);
      expect(table['_dimension']).toEqual({ height: 5, width: 5 });
      expect(table['_origin']).toEqual({ x: 0, y: 0 });
    });

    it('Should return false if the postion is not within the table dimension', () => {
      const position: Position = { x: 5, y: 2 };
      const result = table.isValidPosition(position);
      expect(result).toBe(false);
      expect(table['_dimension']).toEqual({ height: 5, width: 5 });
      expect(table['_origin']).toEqual({ x: 0, y: 0 });
    });
  });

  describe('Create', () => {
    it('Should create a new table with the given dimension', () => {
      const result = Table.create({ height: 7, width: 7 });
      const table = result.getValue();
      expect(table).toBeDefined();
      expect(table!['_dimension']).toEqual({ height: 7, width: 7 });
    });

    it('should return a failed Result if an error occurs during creation', () => {
      jest.spyOn(Table, 'create').mockImplementation(() => {
        return {
          isSuccess: false,
          getValue: () => undefined,
        } as Result<Table>;
      });

      const result = Table.create();
      expect(result.isSuccess).toBe(false);
      expect(result.getValue()).toBe(undefined);
    });
  });
});
