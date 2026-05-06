import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import WithdrawalsService from '../../../../src/services/postgres/WithdrawalsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('WithdrawalsService :: addWithdrawals', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new WithdrawalsService();
    vi.clearAllMocks();
  });

  it('TCM-5A - Data penarikan valid', async () => {
    const fakeWithdrawal = { id: 'with-1', status: 'pending' };
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [fakeWithdrawal],
    });

    const result = await service.addWithdrawals('card-1', 'balance-1', 100000);
    expect(result).toEqual(fakeWithdrawal);
  });

  it('TCM-5B - Proses penyimpanan penarikan gagal', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });

    await expect(service.addWithdrawals('card-1', 'balance-1', 100000)).rejects.toThrow('Failed to withdrawal');
  });
});
