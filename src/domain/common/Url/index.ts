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
      // Basic URL validation regex
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlPattern.test(url)) {
        return Err(new ValidationError("Invalid URL"));
      }
      return Ok(new Url(url));
    } catch(error: any) {
      return Err(new ValidationError("Invalid URL"));
    }
  }

  get value() {
    return this._value;
  }

  
}

export default Url;