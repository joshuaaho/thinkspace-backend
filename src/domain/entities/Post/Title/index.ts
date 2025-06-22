import ValueObject from '@domain/core/BaseValueObject';
import { Ok, Err, Result } from 'ts-results-es';
import { ValidationError } from '@domain/errors';

class Title extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super()
    this._value = value;

  }

  public static create(title: string): Result<Title, ValidationError> {
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      return Err(new ValidationError("Title cannot be empty"));
    }
    
    if (trimmedTitle.length > 100) {
      return Err(new ValidationError("Title cannot be longer than 100 characters"));
    }

    return Ok(new Title(trimmedTitle));
  }
  
  get value(): string {
    return this._value;
  }

}

export default Title;



