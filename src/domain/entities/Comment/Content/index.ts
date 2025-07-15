import ValueObject from "@domain/core/BaseValueObject";
import { Result, Ok, Err } from "ts-results-es";
import { ValidationError } from "@domain/errors";
class Content extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(content: string): Result<Content, ValidationError> {
    if (content.length < 3) {
      return Err(new ValidationError("Content is too short"));
    }

    if (content.length > 500) {
      return Err(new ValidationError("Content is too long"));
    }

    return Ok(new Content(content));
  }
  public get value(): string {
    return this._value;
  }
}

export default Content;
