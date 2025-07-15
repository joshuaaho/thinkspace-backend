import { Result, Ok, Err } from "ts-results-es";
import ValueObject from "@domain/core/BaseValueObject";
import { ValidationError } from "@domain/errors";

class Work extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(work: string): Result<Work, ValidationError> {
    const trimmedWork = work.trim();
    if (trimmedWork.length < 3) {
      return Err(
        new ValidationError(
          "Work information cannot be less than 3 characters",
        ),
      );
    }

    if (trimmedWork.length > 100) {
      return Err(
        new ValidationError("Work information cannot exceed 100 characters"),
      );
    }

    return Ok(new Work(trimmedWork));
  }

  get value(): string {
    return this._value;
  }
}

export default Work;
