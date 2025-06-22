import { Result, Ok, Err } from 'ts-results-es';
import ValueObject from '@domain/core/BaseValueObject';
import { ValidationError } from '@domain/errors';

class Work extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(work: string): Result<Work, ValidationError> {
    if (!work || work.trim().length === 0) {
      return Err(new ValidationError("Work information cannot be empty"));
    }

    if (work.length > 200) {
      return Err(new ValidationError("Work information cannot exceed 200 characters"));
    }

    return Ok(new Work(work));
  }

  get value(): string {
    return this._value;
  }
}

export default Work; 