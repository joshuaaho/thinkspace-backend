import { Result, Ok, Err } from "ts-results-es";
import ValueObject from "@domain/core/BaseValueObject";
import { ValidationError } from "@domain/errors";

class Location extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(location: string): Result<Location, ValidationError> {
    const trimmedLocation = location.trim();
    if (trimmedLocation.length < 3) {
      return Err(
        new ValidationError("Location cannot have less than 3 characters"),
      );
    }

    if (trimmedLocation.length > 100) {
      return Err(new ValidationError("Location cannot exceed 100 characters"));
    }

    return Ok(new Location(trimmedLocation));
  }

  get value(): string {
    return this._value;
  }
}

export default Location;
