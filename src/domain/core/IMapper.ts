import BaseEntity from "@domain/core/BaseEntity";

export interface IDataMapper<T extends BaseEntity> {
  toDomain(dalEntity: any): T;
  toDalEntity(entity: T): any;
}
