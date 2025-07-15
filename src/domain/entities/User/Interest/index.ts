import { Result, Ok, Err } from "ts-results-es";
import ValueObject from "@domain/core/BaseValueObject";
import { ValidationError } from "@domain/errors";

class Interest extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(interest: string): Result<Interest, ValidationError> {
    const trimmedInterest = interest.trim();
    if (trimmedInterest.length < 3) {
      return Err(
        new ValidationError("Interest cannot have less than 3 characters"),
      );
    }

    if (trimmedInterest.length > 100) {
      return Err(new ValidationError("Interest cannot exceed 100 characters"));
    }

    return Ok(new Interest(trimmedInterest));
  }

  get value(): string {
    return this._value;
  }
}

export default Interest;
