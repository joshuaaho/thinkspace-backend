import { Result, Ok, Err } from "ts-results-es";
import ValueObject from "@domain/core/BaseValueObject";
import { ValidationError } from "@domain/errors";

class Bio extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(bio: string): Result<Bio, ValidationError> {
    const trimmedBio = bio.trim();
    if (trimmedBio.length < 3) {
      return Err(new ValidationError("Bio cannot have less than 3 characters"));
    }

    if (trimmedBio.length > 100) {
      return Err(new ValidationError("Bio cannot exceed 100 characters"));
    }

    return Ok(new Bio(trimmedBio));
  }

  get value(): string {
    return this._value;
  }
}

export default Bio;
