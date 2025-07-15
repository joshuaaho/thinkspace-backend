import { Result, Ok, Err } from "ts-results-es";
import ValueObject from "@domain/core/BaseValueObject";
import { ValidationError } from "@domain/errors";

class Url extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(url: string): Result<Url, ValidationError> {
    try {
      const urlPattern =
        /^https?:\/\/[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(:[0-9]+)?(\/.*)?$/;

      if (!urlPattern.test(url)) {
        return Err(
          new ValidationError("Invalid URL. Must be a valid HTTP or HTTPS URL"),
        );
      }

      return Ok(new Url(url));
    } catch (_error) {
      return Err(new ValidationError("Invalid URL"));
    }
  }

  get value() {
    return this._value;
  }
}

export default Url;
