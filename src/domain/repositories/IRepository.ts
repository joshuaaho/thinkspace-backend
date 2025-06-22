import { Option } from 'ts-results-es';

import BaseEntity from '@domain/core/BaseEntity';
import EntityId from '@domain/core/EntityId';


interface IRepositoryPort<T extends BaseEntity> {

  findById(id: string): Promise<Option<T>>;
  save(entity: T): Promise<void>;
  findAll(): Promise<T[]>;
  delete(entityId: EntityId): Promise<void>;
  deleteAll(): Promise<void>;


}

export default IRepositoryPort;
