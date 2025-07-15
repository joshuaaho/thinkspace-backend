import { Result, Ok, Err } from "ts-results-es";
import ValueObject from "@domain/core/BaseValueObject";
import { ValidationError } from "@domain/errors";

class Tag extends ValueObject {
  private readonly _value: string;

  private constructor(tag: string) {
    super();
    this._value = tag;
  }

  public static create(tag: string): Result<Tag, ValidationError> {
    const trimmedTag = tag.trim();
    if (trimmedTag.length < 3) {
      return Err(new ValidationError("Tag cannot be less than 3 characters"));
    }

    if (trimmedTag.length > 20) {
      return Err(
        new ValidationError("Tag cannot be longer than 20 characters"),
      );
    }

    if (!/^[a-zA-Z0-9]+$/.test(trimmedTag)) {
      return Err(
        new ValidationError("Tag must contain only alphanumeric characters"),
      );
    }

    return Ok(new Tag(trimmedTag));
  }

  get value(): string {
    return this._value;
  }
}

export default Tag;
