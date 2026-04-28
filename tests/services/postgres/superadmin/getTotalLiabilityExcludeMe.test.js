import { describe, it, expect, vi, beforeEach } from 'vitest';
import BalancesService from '../../../../src/services/postgres/BalancesService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('BalancesService :: getTotalLiabilityExcludeMe', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new BalancesService();
    vi.clearAllMocks();
  });

  it('TCS-14A - ID user saat ini valid dan terdapat beberapa user lain di tabel balances', async () => {
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ total_liability: 150000, total_accounts: 3 }],
    });

    const result = await service.getTotalLiabilityExcludeMe('user-1');
    expect(result).toEqual({ total_liability: 150000, total_accounts: 3 });
  });
});
