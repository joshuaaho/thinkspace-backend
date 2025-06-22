import { Result, Ok, Err } from 'ts-results-es';
import ValueObject from '@domain/core/BaseValueObject';
import { ValidationError } from '@domain/errors';

class Interest extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(interest: string): Result<Interest, ValidationError> {
    if (!interest || interest.trim().length === 0) {
      return Err(new ValidationError("Interest cannot be empty"));
    }

    if (interest.length > 200) {
      return Err(new ValidationError("Interest cannot exceed 200 characters"));
    }

    return Ok(new Interest(interest));
  }

  get value(): string {
    return this._value;
  }
}

export default Interest; 