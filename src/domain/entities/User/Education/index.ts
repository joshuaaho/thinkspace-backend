import { Result, Ok, Err } from 'ts-results-es';
import ValueObject from '@domain/core/BaseValueObject';
import { ValidationError }   from '@domain/errors';

class Education extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(education: string): Result<Education, ValidationError> {
    if (!education || education.trim().length === 0) {
      return Err(new ValidationError("Education information cannot be empty"));
    }

    if (education.length > 300) {
      return Err(new ValidationError("Education information cannot exceed 300 characters"));
    }

    return Ok(new Education(education));
  }

  get value(): string {
    return this._value;
  }
}

export default Education; 