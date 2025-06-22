import { Result, Ok, Err } from 'ts-results-es';
import ValueObject from '@domain/core/BaseValueObject';
import { ValidationError }   from '@domain/errors';

class Bio extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(bio: string): Result<Bio, ValidationError> {
    if (!bio || bio.trim().length === 0) {
      return Err(new ValidationError("Bio cannot be empty"));
    }

    if (bio.length > 500) {
      return Err(new ValidationError("Bio cannot exceed 500 characters"));
    }

    return Ok(new Bio(bio));
  }

  get value(): string {
    return this._value;
  }
}

export default Bio; 