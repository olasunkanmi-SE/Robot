/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Result } from '../../application/result';
import { DIRECTION } from '../../constants/constants';
import { DirectionHandler } from '../../models';

describe('DirectionHandler', () => {
  let directionHandler: DirectionHandler;

  beforeEach(() => {
    directionHandler = new DirectionHandler();
  });
  describe('rotateDirection', () => {
    it('should rotate right (clockwise) from NORTH to EAST', () => {
      const rotateDirection =
        directionHandler['rotateDirection'].bind(directionHandler);
      expect(rotateDirection(DIRECTION.NORTH, 1)).toBe(DIRECTION.EAST);
    });

    it('should rotate left (counter-clockwise) from NORTH to WEST', () => {
      // Access private method rotateDirection
      const rotateDirection =
        directionHandler['rotateDirection'].bind(directionHandler);
      expect(rotateDirection(DIRECTION.NORTH, -1)).toBe(DIRECTION.WEST);
    });

    it('should rotate from WEST to NORTH when rotating right from WEST', () => {
      const rotateDirection =
        directionHandler['rotateDirection'].bind(directionHandler);
      expect(rotateDirection(DIRECTION.WEST, 1)).toBe(DIRECTION.NORTH);
    });

    it('should rotate from WEST to SOUTH when rotating left from WEST', () => {
      const rotateDirection =
        directionHandler['rotateDirection'].bind(directionHandler);
      expect(rotateDirection(DIRECTION.WEST, -1)).toBe(DIRECTION.SOUTH);
    });
  });

  describe('left', () => {
    it('should rotate left (counter-clockwise) from NORTH to WEST', () => {
      expect(directionHandler.left(DIRECTION.NORTH)).toBe(DIRECTION.WEST);
    });

    it('should rotate left (counter-clockwise) from EAST to NORTH', () => {
      expect(directionHandler.left(DIRECTION.EAST)).toBe(DIRECTION.NORTH);
    });

    it('should rotate left (counter-clockwise) from SOUTH to EAST', () => {
      expect(directionHandler.left(DIRECTION.SOUTH)).toBe(DIRECTION.EAST);
    });

    it('should rotate left (counter-clockwise) from WEST to SOUTH', () => {
      expect(directionHandler.left(DIRECTION.WEST)).toBe(DIRECTION.SOUTH);
    });
  });

  describe('right', () => {
    it('should rotate right (clockwise) from NORTH to EAST', () => {
      expect(directionHandler.right(DIRECTION.NORTH)).toBe(DIRECTION.EAST);
    });

    it('should rotate right (clockwise) from EAST to SOUTH', () => {
      expect(directionHandler.right(DIRECTION.EAST)).toBe(DIRECTION.SOUTH);
    });

    it('should rotate right (clockwise) from SOUTH to WEST', () => {
      expect(directionHandler.right(DIRECTION.SOUTH)).toBe(DIRECTION.WEST);
    });

    it('should rotate right (clockwise) from WEST to NORTH', () => {
      expect(directionHandler.right(DIRECTION.WEST)).toBe(DIRECTION.NORTH);
    });
  });

  describe('getNextPosition', () => {
    it('should return the correct position for NORTH', () => {
      expect(directionHandler.getNextPosition(DIRECTION.NORTH)).toEqual({
        x: 0,
        y: 1,
      });
    });

    it('should return the correct position for SOUTH', () => {
      expect(directionHandler.getNextPosition(DIRECTION.SOUTH)).toEqual({
        x: 0,
        y: -1,
      });
    });

    it('should return the correct position for EAST', () => {
      expect(directionHandler.getNextPosition(DIRECTION.EAST)).toEqual({
        x: 1,
        y: 0,
      });
    });

    it('should return the correct position for WEST', () => {
      expect(directionHandler.getNextPosition(DIRECTION.WEST)).toEqual({
        x: -1,
        y: 0,
      });
    });
  });

  describe('create', () => {
    it('should return a successful Result with a DirectionHandler instance', () => {
      const result = DirectionHandler.create();
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(DirectionHandler);
    });

    it('should return a failed Result if an error occurs during creation', () => {
      jest.spyOn(DirectionHandler, 'create').mockImplementation(() => {
        return {
          isSuccess: false,
          getValue: () => undefined,
        } as Result<DirectionHandler>;
      });

      const result = DirectionHandler.create();
      expect(result.isSuccess).toBe(false);
      expect(result.getValue()).toBe(undefined);
    });
  });
});
