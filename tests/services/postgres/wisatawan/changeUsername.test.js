import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsersService from '../../../../src/services/postgres/UsersService.js';

let mockPool;

describe('UsersService :: changeUsername', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new UsersService();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  it('TCW-13A - Username terdaftar dan data valid', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'u-1' }] });
    const result = await service.changeUsername('u-1', 'newname');
    expect(result).toBeDefined();
  });

  it('TCW-13B - Username tidak terdaftar', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    await expect(service.changeUsername('u-unknown', 'newname')).rejects.toThrow(
      'Failed to change username',
    );
  });
});
