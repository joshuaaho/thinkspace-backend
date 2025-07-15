import { vi } from "vitest";

const createBaseRepositoryMock = () => ({
  findById: vi.fn(),
  save: vi.fn(),
  findAll: vi.fn(),
  delete: vi.fn(),
  deleteAll: vi.fn(),
  deleteMany: vi.fn(),
});

export const createUserRepositoryMock = () => ({
  ...createBaseRepositoryMock(),

  findById: vi.fn(),
  findByUsername: vi.fn(),
  findByRefreshToken: vi.fn(),
  findByEmail: vi.fn(),
  query: vi.fn(),
});

export const createJwtServiceMock = () => ({
  createAccessToken: vi.fn(),
  createRefreshToken: vi.fn(),
  verifyAccessToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
});

export const createPostRepositoryMock = () => ({
  ...createBaseRepositoryMock(),

  query: vi.fn(),
});

export const createCommentRepositoryMock = () => ({
  ...createBaseRepositoryMock(),
  deleteMany: vi.fn(),
  query: vi.fn(),
});

export const createFileUploadServiceMock = () => ({
  getUploadUrl: vi.fn(),
});

export const createMessageRepositoryMock = () => ({
  ...createBaseRepositoryMock(),

  query: vi.fn(),
  getChatList: vi.fn(),
});

export const createMessageServiceMock = () => ({
  sendMessage: vi.fn(),
});

export const createNotificationServiceMock = () => ({
  sendNotification: vi.fn(),
  sendNotifications: vi.fn(),
});

export const createNotificationRepositoryMock = () => ({
  ...createBaseRepositoryMock(),
  query: vi.fn(),
  saveMany: vi.fn(),
  getUnreadCount: vi.fn(),
  findAllBy: vi.fn(),
});
