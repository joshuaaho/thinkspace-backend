import { describe, it, expect } from 'vitest';
import Location from './index';
import { ValidationError } from "@domain/errors";

describe('Location Value Object', () => {
  describe('create valid location', () => {
    const result = Location.create('New York, USA').unwrap();

    it('should have correct value', () => {
      expect(result.value).toBe('New York, USA');
    });
  });

  describe('create invalid location', () => {
    it('should return error for empty location', () => {
      const result = Location.create('');
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });

    it('should return error for location exceeding 150 characters', () => {
      const longLocation = 'a'.repeat(151);
      const result = Location.create(longLocation);
      expect(result.unwrapErr()).toBeInstanceOf(ValidationError);
    });
  });
}); 