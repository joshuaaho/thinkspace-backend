import EntityId from "@domain/core/EntityId";
import { v4 as uuid } from "uuid";
import { IDomainEvent } from "@domain/core/IDomainEvent";
import { DomainEvents } from "@domain/events/DomainEvents";
abstract class BaseEntity {
  protected readonly _id: EntityId;
  protected _createdAt: Date;
  private _domainEvents: IDomainEvent[] = [];
  constructor(id?: EntityId, createdAt?: Date) {
    this._id = id ?? EntityId.create(uuid());
    this._createdAt = createdAt ?? new Date();
  }

  get id(): EntityId {
    return this._id;
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }
  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  equals(other: BaseEntity): boolean {
    return this.id.equals(other.id);
  }

  public addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);

    DomainEvents.markEntityForDispatch(this);
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}

export default BaseEntity;
