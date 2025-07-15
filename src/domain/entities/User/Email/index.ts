import { Result, Ok, Err } from "ts-results-es";
import * as EmailValidator from "email-validator";
import ValueObject from "../../../core/BaseValueObject";
import { ValidationError } from "@domain/errors";

class Email extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(email: string): Result<Email, ValidationError> {
    if (!EmailValidator.validate(email)) {
      return Err(new ValidationError("Invalid email format"));
    }

    return Ok(new Email(email));
  }

  get value(): string {
    return this._value;
  }
}

export default Email;
