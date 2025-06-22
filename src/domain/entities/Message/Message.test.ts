import { describe, it, expect } from 'vitest';
import Message from './index';
import EntityId from '@domain/core/EntityId';
import Text from './Text';
import MessageCreated from "@domain/events/MessageCreated";
import { DomainEvents } from "@domain/events/DomainEvents";

describe('Message', () => {
  describe('creating a message with basic properties', () => {
    const chatId = EntityId.create('chat1');
    const senderId = EntityId.create('sender1');
    const receiverId = EntityId.create('receiver1');
    const text = Text.create('Hello, world!').unwrap();
    const message = Message.create({
 
      senderId,
      text,
      receiverId,
    });


    it('should have correct sender id', () => {
      expect(message.senderId.equals(senderId)).toBe(true);
    });

    it('should have correct receiver id', () => {
      expect(message.receiverId.equals(receiverId)).toBe(true);
    });

    it('should have correct text', () => {
      expect(message.text.equals(text)).toBe(true);
    });

    it('should have a generated id', () => {
      expect(message.id).toBeDefined();
    });

    it('should have a domain event', () => {
      expect(message.domainEvents.length).toBe(1);
      expect(message.domainEvents[0]).toBeInstanceOf(MessageCreated);
    });

    it('should be marked as an entity', () => {
      expect(DomainEvents.containsMarkedEntity(message)).toBe(true);
    });
  });

  describe('creating a message with specific id', () => {
    const id = EntityId.create('message1');
    const chatId = EntityId.create('chat1');
    const senderId = EntityId.create('sender1');
    const receiverId = EntityId.create('receiver1');
    const text = Text.create('Hello, world!').unwrap();
    const message = Message.create({
      id,

      senderId,
      text,
      receiverId,
    });

    it('should have the provided id', () => {
      expect(message.id.equals(id)).toBe(true);
    });

    

    it('should have correct sender id', () => {
      expect(message.senderId.equals(senderId)).toBe(true);
    });

    it('should have correct receiver id', () => {
      expect(message.receiverId.equals(receiverId)).toBe(true);
    });

    it('should have correct text', () => {
      expect(message.text.equals(text)).toBe(true);
    });

    it('should not have a domain event', () => {
      expect(message.domainEvents.length).toBe(0);
    });
  });
});
