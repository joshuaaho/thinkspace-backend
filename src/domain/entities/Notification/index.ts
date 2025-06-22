import BaseEntity from "@domain/core/BaseEntity";
import EntityId from "@domain/core/EntityId";
import { Result, Ok, Err } from "ts-results-es";

interface NotificationProps {
  id?: EntityId;
  to: EntityId;
  from: EntityId;
  message: string;
  isRead: boolean;
  resourceId: string;
  redirectToResourceType: string;
  createdAt?: Date;
}

export class Notification extends BaseEntity {
  private readonly _to: EntityId;
  private readonly _from: EntityId;
  private readonly _message: string;
  private _isRead: boolean;
  private readonly _resourceId: string;
  private readonly _redirectToResourceType: string;

  private constructor(props: NotificationProps) {
    super(props.id, props.createdAt);
    this._to = props.to;
    this._from = props.from;
    this._message = props.message;
    this._isRead = props.isRead;
    this._resourceId = props.resourceId;
    this._redirectToResourceType = props.redirectToResourceType;

  }

  public static create(props: NotificationProps): Notification {
    return new Notification(props);
  }

  public get to(): EntityId {
    return this._to;
  }

  public get from(): EntityId {
    return this._from;
  }

  public get message(): string {
    return this._message;
  }

  public get isRead(): boolean {
    return this._isRead;
  }

  public get resourceId(): string   {
    return this._resourceId;
  }
  
  public get redirectToResourceType(): string {
    return this._redirectToResourceType;
  }

  public markAsRead(): void {
    this._isRead = true;
  }

  public markAsUnread(): void {
    this._isRead = false;
  }
}

export default Notification; 