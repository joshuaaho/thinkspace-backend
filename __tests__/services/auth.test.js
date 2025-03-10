import { jest, describe, it, expect } from '@jest/globals';
import authService from '#services/auth.service';
import User from '#models/user.model';
import tokenService from '#services/token.service';
import AppError from '#classes/AppError';
import bcrypt from 'bcryptjs';

jest.mock('#services/token.service', () => ({
  generateRefreshToken: jest.fn(),
  generateAccessToken: jest.fn(),
}));

jest.mock('#utils/logger', () => ({ info: jest.fn() }));

jest.mock('@models/user.model', () => {
  return {
    findOne: jest.fn(() => ({
      _id: 'user123',
      username: 'testuser',
      password: 'hashedPassword',
    })),
  };
});

jest.mock('bcryptjs', () => {
  return {
    compare: jest.fn(() => true),
  };
});

describe('Auth Service - Login', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });
  // User.findOne.mockResolvedValue(5);
  it('should successfully login with valid credentials', async () => {
    const result = await authService.login('testuser', 'password123');

    expect(User.findOne).toHaveBeenCalled();
    expect(tokenService.generateRefreshToken).toHaveBeenCalled();
    expect(tokenService.generateAccessToken).toHaveBeenCalled();
    expect(result).toHaveProperty('refreshToken');
    expect(result).toHaveProperty('accessToken');
    expect(tokenService.generateRefreshToken).toHaveBeenCalledWith('user123');
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith('user123');
    expect(bcrypt.compare).toHaveBeenCalled();
  });

  it('should throw error when user not found', async () => {
    // Mock user not found
    User.findOne.mockResolvedValue(null);

    // Execute and assert
    await expect(authService.login('wronguser', 'password123')).rejects.toThrow(new AppError('User not found', 404));
  });

  it('should throw error when password is incorrect', async () => {
    // Mock data
    const mockUser = {
      _id: 'user123',
      username: 'testuser',
      password: 'hashedPassword',
    };

    // Mock responses
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    // Execute and assert
    await expect(authService.login('testuser', 'wrongpassword')).rejects.toThrow(new AppError('Wrong password', 404));
  });
});
