/**
 * Represents the result of an operation, encapsulating success/failure status,
 * optional data, and an optional message.  This class promotes a consistent
 * way to handle operation outcomes, improving error handling and code clarity.
 * @template T The type of the data contained in a successful result.
 */
export class Result<T> {
  public readonly isSuccess: boolean;
  private readonly data?: T;
  public readonly message?: string;

  private constructor(isSuccess: boolean, data?: T, message?: string) {
    this.isSuccess = isSuccess;
    this.data = data;
    this.message = message;
  }

  public getValue(): T | undefined {
    return this.data;
  }

  public static ok<U>(data: U, message?: string): Result<U> {
    return new Result<U>(true, data, message);
  }

  public static fail<U>(message: string): Result<U> {
    return new Result<U>(false, undefined, message);
  }
}
