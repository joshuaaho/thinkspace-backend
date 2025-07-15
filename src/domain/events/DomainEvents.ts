import BaseEntity from "@domain/core/BaseEntity";
import EntityId from "@domain/core/EntityId";
import { IDomainEvent } from "@domain/core/IDomainEvent";

export class DomainEvents {
  private static handlersMap: Record<
    string,
    ((event: IDomainEvent) => void)[]
  > = {};
  private static markedEntities: BaseEntity[] = [];

  public static markEntityForDispatch(entity: BaseEntity): void {
    const entityFound = !!this.findMarkedEntityByID(entity.id);

    if (!entityFound) {
      this.markedEntities.push(entity);
    }
  }

  private static dispatchAggregateEvents(entity: BaseEntity): void {
    entity.domainEvents.forEach((event: IDomainEvent) => this.dispatch(event));
  }

  private static removeEntityFromMarkedDispatchList(entity: BaseEntity): void {
    const index = this.markedEntities.findIndex((a) => a.equals(entity));
    this.markedEntities.splice(index, 1);
  }

  private static findMarkedEntityByID(id: EntityId): BaseEntity | null {
    let found: BaseEntity | null = null;

    for (const entity of this.markedEntities) {
      if (entity.id.equals(id)) {
        found = entity;
      }
    }

    return found;
  }

  public static dispatchEventsForAggregate(id: EntityId): void {
    const entity = this.findMarkedEntityByID(id);

    if (entity) {
      this.dispatchAggregateEvents(entity);
      entity.clearEvents();
      this.removeEntityFromMarkedDispatchList(entity);
    }
  }

  public static register(
    callback: (event: any) => void,
    eventClassName: string,
  ): void {
    if (
      !Object.prototype.hasOwnProperty.call(this.handlersMap, eventClassName)
    ) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(callback);
  }

  public static clearHandlers(): void {
    this.handlersMap = {};
  }

  public static clearMarkedEntities(): void {
    this.markedEntities = [];
  }

  private static dispatch(event: IDomainEvent): void {
    const eventClassName: string = event.constructor.name;

    if (
      Object.prototype.hasOwnProperty.call(this.handlersMap, eventClassName)
    ) {
      const handlers: any[] = this.handlersMap[eventClassName];
      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  public static getMarkedEntities(): BaseEntity[] {
    return this.markedEntities;
  }

  public static containsMarkedEntity(entity: BaseEntity): boolean {
    return this.markedEntities.some((e) => e.equals(entity));
  }
}
