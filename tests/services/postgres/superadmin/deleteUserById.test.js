import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsersService from '../../../../src/services/postgres/UsersService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('UsersService :: deleteUserById', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new UsersService();
    // mock console.error to avoid test output noise
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  it('TCS-13A - ID pengguna valid dan data ditemukan di database', async () => {
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 'user-1' }],
    });

    const result = await service.deleteUserById('user-1');
    expect(result).toEqual({ deletedId: 'user-1' });
  });

  it('TCS-13B - ID pengguna tidak ditemukan di database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(service.deleteUserById('user-not-found'))
      .rejects.toThrow('User with ID user-not-found not found');
  });

  it('TCS-13C - Terjadi kesalahan saat eksekusi query', async () => {
    const error = new Error('DB Error');
    mockPool.query.mockRejectedValueOnce(error);

    await expect(service.deleteUserById('user-1')).rejects.toThrow(error);
    expect(console.error).toHaveBeenCalledWith('❌ Error deleting user:', error);
  });
});
