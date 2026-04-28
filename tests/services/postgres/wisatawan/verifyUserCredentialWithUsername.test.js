import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsersService from '../../../../src/services/postgres/UsersService.js';
import bcrypt from 'bcrypt';

let mockPool;

describe('UsersService :: verifyUserCredentialWithUsername', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new UsersService();
    vi.clearAllMocks();
  });

  it('TCW-12A - Username tidak terdaftar di database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    await expect(service.verifyUserCredentialWithUsername('unknown', 'pass')).rejects.toThrow('is not registered');
  });

  it('TCW-12B - Username terdaftar tetapi password yang dimasukkan tidak sesuai', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'u-1', password: 'hash', title: 'user' }] });
    vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false); 
    await expect(service.verifyUserCredentialWithUsername('testuser', 'wrongpass')).rejects.toThrow('Password is incorrect');
  });

  it('TCW-12C - Username terdaftar dan password sesuai', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'u-1', password: 'hash', title: 'user' }] });
    vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true); 
    const result = await service.verifyUserCredentialWithUsername('testuser', 'correctpass');
    expect(result.id).toBe('u-1');
    expect(result.scope).toBe('user');
  });
});
