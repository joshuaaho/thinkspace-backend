import ValueObject from '../../../core/BaseValueObject';
import { Result, Ok } from 'ts-results-es';

class Content extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;

  }

  public static create(content: string): Result<Content, never> {
    return Ok(new Content(content));
  }
  
  get value(): string {
    return this._value;
  }
} 

export default Content;