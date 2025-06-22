import { describe, it, expect } from 'vitest';
import Tag from '@domain/entities/Post/Tag';
import { ValidationError } from '@domain/errors';

describe('Tag', () => {
  describe('creating a valid tag', () => {
    const result = Tag.create('validtag123');

    it('should have correct value', () => {
      expect(result.unwrap().value).toBe('validtag123');
    });
  });

  describe('creating an invalid tag', () => {
    it('should return validation error when tag is empty', () => {
      const result = Tag.create('');
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it('should return validation error when tag exceeds 20 characters', () => {
      const result = Tag.create('a'.repeat(21));
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it('should return validation error when tag contains spaces', () => {
      const result = Tag.create('invalid tag');
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it('should return validation error when tag contains special characters', () => {
      const result = Tag.create('invalid-tag!');
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });

  describe('comparing tags', () => {
    const tag1 = Tag.create('tag1').unwrap();
    const tag2 = Tag.create('tag1').unwrap();
    const tag3 = Tag.create('tag2').unwrap();

    it('should return true for equal tags', () => {
      expect(tag1.equals(tag2)).toBe(true);
    });

    it('should return false for different tags', () => {
      expect(tag1.equals(tag3)).toBe(false);
    });
  });
}); 