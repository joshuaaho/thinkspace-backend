import { describe, it, expect } from "vitest";
import Notification from "@domain/entities/Notification";
import EntityId from "@domain/core/EntityId";

describe("Notification", () => {
  describe("creating a notification with basic properties", () => {
    const to = EntityId.create("1");
    const from = EntityId.create("2");
    const message = "Test notification message";
    const resourceId = "post_123";
    const notification = Notification.create({
      to,
      from,
      message,
      resourceId,
      isRead: false,
      redirectToResourceType: "post"
    });

    it("should have correct to id", () => {
      expect(notification.to.equals(to)).toBe(true);
    });

    it("should have correct from id", () => {
      expect(notification.from.equals(from)).toBe(true);
    });

    it("should have correct message", () => {
      expect(notification.message).toBe(message);
    });

    it("should have correct resource id", () => {
      expect(notification.resourceId).toBe(resourceId);
    });

    it("should have isRead set to false", () => {
      expect(notification.isRead).toBe(false);
    });
  });

  describe("marking a notification as read", () => {
    const to = EntityId.create("1");
    const from = EntityId.create("2");
    const message = "Test notification message";
    const resourceId = "post_123";
    const notification = Notification.create({
      to,
      from,
      message,
      resourceId,
      isRead: false,
      redirectToResourceType: "post"
    });

    notification.markAsRead();

    it("should set isRead to true", () => {
      expect(notification.isRead).toBe(true);
    });
  });
}); 