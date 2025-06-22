import { describe, it, expect } from "vitest";
import { None, Some } from "ts-results-es";
import {
  createUserRepositoryMock,
  createFileUploadServiceMock,
} from "@utils/testData/mocks";
import { UnauthenticatedError } from "@application/useCases/errors";
import { createUserOne } from "@utils/testData/testEntities";
import CreateFileUploadUrlUseCase from "./createFileUploadUrl";

describe("Create File Upload URL Use Case", () => {
  describe("when user is authenticated", async () => {
    const testUser = createUserOne();
    const testUploadUrl = "https://test-bucket.s3.amazonaws.com/test-key";

    const mockUserRepo = createUserRepositoryMock();
    mockUserRepo.findById.mockResolvedValue(Some(testUser));

    const mockFileUploadService = createFileUploadServiceMock();
    mockFileUploadService.getUploadUrl.mockResolvedValue(testUploadUrl);

    const createFileUploadUrl = new CreateFileUploadUrlUseCase(
      mockFileUploadService,
 
    );

    const result = await createFileUploadUrl.execute();
    it("should get upload URL from service", () => {
      expect(mockFileUploadService.getUploadUrl).toHaveBeenCalled();
    });

    it("should return success with upload URL", () => {
      expect(result).toBe(testUploadUrl);
    });
  });

 
});
