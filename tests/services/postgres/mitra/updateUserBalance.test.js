import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import BalancesService from '../../../../src/services/postgres/BalancesService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('BalancesService :: updateUserBalance', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new BalancesService();
    vi.clearAllMocks();
  });

  it('TCM-13A - ID user valid dan data saldo berhasil diperbarui', async () => {
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [{ user_id: 'user-1', amount: 50000 }],
    });

    const result = await service.updateUserBalance(50000, 'user-1');
    expect(result).toEqual({ user_id: 'user-1', amount: 50000 });
  });

  it('TCM-13B - ID user tidak ditemukan di database', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });

    await expect(service.updateUserBalance(50000, 'user-not-found')).rejects.toThrow('Failed to update user balance');
  });
});
