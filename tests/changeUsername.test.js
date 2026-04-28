import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvariantError } from '../src/exceptions/InvariantError.js';
import UsersService from '../src/services/postgres/UsersService.js';

describe('UsersService :: changeUsername', () => {
  let service;
  let mockPool;

  beforeEach(() => {
    // 1. Buat mock pool
    mockPool = {
      query: vi.fn(),
    };

    // 2. Buat instance service ASLI, tapi override _pool
    service = new UsersService();
    service._pool = mockPool; // Inject mock pool ke service

    vi.clearAllMocks();
  });

  it('should change username successfully', async () => {
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 'user-1', username: 'eysar123' }],
    });

    const result = await service.changeUsername('eysar123', 'user-1');

    expect(result).toEqual({
      id: 'user-1',
      username: 'eysar123',
    });
    expect(mockPool.query).toHaveBeenCalledTimes(1);
  });

  it('should throw InvariantError when update fails', async () => {
    mockPool.query.mockResolvedValueOnce({
      rowCount: 0,
      rows: [],
    });

    await expect(service.changeUsername('eysar123', 'user-999')).rejects.toThrow(InvariantError);
    expect(mockPool.query).toHaveBeenCalledTimes(1);
  });
});
