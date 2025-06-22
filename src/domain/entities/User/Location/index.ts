  import { Result, Ok, Err } from 'ts-results-es';
import ValueObject from '@domain/core/BaseValueObject';
import { ValidationError } from '@domain/errors';

class Location extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(location: string): Result<Location, ValidationError> {
    if (!location || location.trim().length === 0) {
      return Err(new ValidationError("Location cannot be empty"));
    }

    if (location.length > 150) {
      return Err(new ValidationError("Location cannot exceed 150 characters"));
    }

    return Ok(new Location(location));
  }

  get value(): string {
    return this._value;
  }
}

export default Location; 