import ValueObject from '@domain/core/BaseValueObject';




class EntityId extends ValueObject {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
  }

  public static create(id: string){
    return new EntityId(id);
  }
  
  get value(): string {
    return this._value;
  }


} 

export default EntityId;