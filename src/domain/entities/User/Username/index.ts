  import { Result, Ok, Err } from 'ts-results-es';
import ValueObject from '@domain/core/BaseValueObject';
import { ValidationError } from '@domain/errors';

class Username extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(username: string): Result<Username, ValidationError> {
    // Check if username is at least 3 characters
    if (username.length < 3) {
      return Err(new ValidationError("Username must be at least 3 characters"));
    }

    // Check if username is not too long
    if (username.length > 20) {
      return Err(new ValidationError("Username cannot exceed 20 characters"));
    }

    // Check if username contains only alphanumeric characters and underscores
    const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!validUsernameRegex.test(username)) {
      return Err(new ValidationError("Username can only contain letters, numbers, and underscores"));
    }

    return Ok(new Username(username));
  }

  get value(): string {
    return this._value;
  }
}

export default Username; 