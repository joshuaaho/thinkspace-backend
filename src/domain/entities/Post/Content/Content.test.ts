import { describe, it, expect } from "vitest";
import Content from "@domain/entities/Post/Content";

describe("Content", () => {
  describe("create valid content", () => {
    const result = Content.create("Some content").unwrap();

    it("should have correct value", () => {
      expect(result.value).toBe("Some content");
    });
  });
});
