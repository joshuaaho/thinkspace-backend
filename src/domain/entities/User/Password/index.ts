import { Result, Ok, Err } from "ts-results-es";
import ValueObject from "@domain/core/BaseValueObject";
import { ValidationError } from "@domain/errors";
import * as bcrypt from "bcryptjs";
import { UnauthenticatedError } from "@application/useCases/errors";

interface PasswordProps {
  value: string;
  hashed?: boolean;
}

class Password extends ValueObject {
  private readonly _value: string;
  private readonly _hashed?: boolean;

  private constructor(props: PasswordProps) {
    super();
    this._value = props.value;
    this._hashed = props.hashed;
  }

  public static create(
    passwordProps: PasswordProps,
  ): Result<Password, ValidationError> {
    if (passwordProps.hashed) {
      return Ok(new Password(passwordProps));
    }

    if (passwordProps.value.length < 8) {
      return Err(new ValidationError("Password must be at least 8 characters"));
    }

    const hasUppercase = /[A-Z]/.test(passwordProps.value);
    const hasLowercase = /[a-z]/.test(passwordProps.value);
    const hasNumber = /[0-9]/.test(passwordProps.value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
      passwordProps.value,
    );

    if (!(hasUppercase && hasLowercase && hasNumber && hasSpecialChar)) {
      return Err(
        new ValidationError(
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        ),
      );
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(passwordProps.value, saltRounds);

    return Ok(new Password({ value: hashedPassword, hashed: true }));
  }

  public async verify(
    plainPassword: string,
  ): Promise<Result<void, UnauthenticatedError>> {
    const isMatch = await bcrypt.compare(plainPassword, this._value);
    if (!isMatch) {
      return Err(new UnauthenticatedError("Invalid password"));
    }
    return Ok.EMPTY;
  }

  get value(): string {
    return this._value;
  }
}

export default Password;
