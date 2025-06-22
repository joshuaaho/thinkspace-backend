import BaseEntity from "@domain/core/BaseEntity";
import EntityId from "@domain/core/EntityId";
import { IDataMapper } from "@domain/core/IMapper";

import IRepositoryPort, {

} from "@domain/repositories/IRepository";

import { Collection, MongoClient, ObjectId, WithId } from "mongodb";
import { None, Option, Some } from "ts-results-es";

export abstract class MongoBaseRepository<T extends BaseEntity>
  implements IRepositoryPort<T>
{
  protected readonly collectionInstance: Collection;
  protected readonly mapper: IDataMapper<T>;

  constructor(collectionInstance: Collection, mapper: IDataMapper<T>) {
    this.collectionInstance = collectionInstance;
    this.mapper = mapper;
  }

  async findById(id: string): Promise<Option<T>> {
    const dalEntity = await this.collectionInstance.findOne({
      id,
    });

    if (!dalEntity) {
      return None;
    }
    const post = this.mapper.toDomain(dalEntity);

    return Some(post);
  }

  async save(entity: T): Promise<void> {

    const entityExists = await this.collectionInstance.findOne({
      id: entity.id.value,
    });
    if (!entityExists) {

      await this.collectionInstance.insertOne(this.mapper.toDalEntity(entity));

      return;
    }

    await this.collectionInstance.replaceOne(
      { id: entity.id.value },
      this.mapper.toDalEntity(entity)
    );

  }


  async delete(entityId: EntityId): Promise<void> {
    await this.collectionInstance.deleteOne({ id: entityId.value });
  }

  async deleteAll(): Promise<void> {

    await this.collectionInstance.deleteMany({});
  }

  async deleteMany(filter: any): Promise<void> {

    await this.collectionInstance.deleteMany(filter);
  }
  
  async findAll(): Promise<T[]> {
    const dalEntities = await this.collectionInstance.find({}).toArray();
    return dalEntities.map((dalEntity) => this.mapper.toDomain(dalEntity));
  }
}
