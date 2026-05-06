import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotFoundError from '../../../../src/exceptions/NotFoundError.js';
import BalancesService from '../../../../src/services/postgres/BalancesService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('BalancesService :: getBalanceByUserId', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new BalancesService();
    vi.clearAllMocks();
  });

  it('TCM-4A - ID pengguna tersedia dalam database', async () => {
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [{ id: 'balance-1', user_id: 'user-1', balance: 500000 }],
    });

    const result = await service.getBalanceByUserId('user-1');
    expect(result).toEqual({ id: 'balance-1', user_id: 'user-1', balance: 500000 });
  });

  it('TCM-4B - ID pengguna tidak tersedia dalam database', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });

    await expect(service.getBalanceByUserId('user-not-found')).rejects.toThrow('Balance not found');
  });
});
