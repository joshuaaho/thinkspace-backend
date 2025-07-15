import { Result, Ok, Err } from "ts-results-es";
import ValueObject from "@domain/core/BaseValueObject";
import { ValidationError } from "@domain/errors";

class Education extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(education: string): Result<Education, ValidationError> {
    const trimmedEducation = education.trim();
    if (trimmedEducation.length < 3) {
      return Err(
        new ValidationError(
          "Education information cannot have less than 3 characters",
        ),
      );
    }

    if (trimmedEducation.length > 100) {
      return Err(
        new ValidationError(
          "Education information cannot exceed 100 characters",
        ),
      );
    }

    return Ok(new Education(trimmedEducation));
  }

  get value(): string {
    return this._value;
  }
}

export default Education;
