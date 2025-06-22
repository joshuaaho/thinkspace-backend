import { Result, Ok, Err } from 'ts-results-es';
import ValueObject from '@domain/core/BaseValueObject';
import { ValidationError } from '@domain/errors';

class Text extends ValueObject {
  private readonly _value: string;

  private constructor(text: string) {
    super();
    this._value = text;
  
  }

  public static create(text: string): Result<Text, ValidationError> {
    
    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return Err(new ValidationError("Text cannot be empty"));
    }

    if (trimmedText.length > 5000) {
      return Err(new ValidationError("Text cannot be longer than 5000 characters"));
    }

    return Ok(new Text(trimmedText));
  }

  get value(): string {
    return this._value;
  }
  
  
} 

export default Text;