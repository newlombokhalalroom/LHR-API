import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import AuthorizationError from '../../../../src/exceptions/AuthorizationError.js';
import WithdrawalsService from '../../../../src/services/postgres/WithdrawalsService.js';

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

const mockPool = {
  query: vi.fn(),
  connect: vi.fn(),
  on: vi.fn(),
};

describe('WithdrawalsService :: updateWithdrawalStatusAtomic', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new WithdrawalsService();
    mockPool.connect.mockResolvedValue(mockClient);
    vi.clearAllMocks();
  });

  it('TCS-3A - "nextStatus" tidak termasuk "pending", "cancelled", atau "success"', async () => {
    await expect(service.updateWithdrawalStatusAtomic('w-1', 'invalid'))
      .rejects.toThrow('Invalid status');
  });

  it('TCS-3B - "nextstatus" = "pending"', async () => {
    await expect(service.updateWithdrawalStatusAtomic('w-1', 'pending'))
      .rejects.toThrow('Invalid status transition');
  });

  it('TCS-3C - "withdrawalId" tidak ditemukan', async () => {
    mockClient.query.mockResolvedValueOnce(); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 0 }); // get withdrawal
    mockClient.query.mockResolvedValueOnce(); // ROLLBACK

    await expect(service.updateWithdrawalStatusAtomic('w-not-found', 'cancelled'))
      .rejects.toThrow('Withdrawal not found');
  });

  it('TCS-3D - Withdrawal ditemukan tetapi status bukan "pending"', async () => {
    mockClient.query.mockResolvedValueOnce(); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ status: 'success' }] }); // get withdrawal
    mockClient.query.mockResolvedValueOnce(); // ROLLBACK

    await expect(service.updateWithdrawalStatusAtomic('w-1', 'cancelled'))
      .rejects.toThrow('Forbidden to change status');
  });

  it('TCS-3E - "nextStatus" = "cancelled" dan balance ditemukan', async () => {
    mockClient.query.mockResolvedValueOnce(); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'w-1', status: 'pending', amount: 50000, balance_id: 'b-1' }] }); // get withdrawal
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // update balance
    mockClient.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'w-1', status: 'cancelled' }] }); // update withdrawal
    mockClient.query.mockResolvedValueOnce(); // COMMIT

    const result = await service.updateWithdrawalStatusAtomic('w-1', 'cancelled');
    expect(result.status).toBe('cancelled');
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
  });

  it('TCS-3F - "nextStatus" = "cancelled" tetapi balance tidak ditemukan', async () => {
    mockClient.query.mockResolvedValueOnce(); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'w-1', status: 'pending', amount: 50000, balance_id: 'b-1' }] }); // get withdrawal
    mockClient.query.mockResolvedValueOnce({ rowCount: 0 }); // update balance fails
    mockClient.query.mockResolvedValueOnce(); // ROLLBACK

    await expect(service.updateWithdrawalStatusAtomic('w-1', 'cancelled'))
      .rejects.toThrow('Balance not found for this user');
  });

  it('TCS-3G - "nextStatus" = "success" dan seluruh proses berhasil', async () => {
    mockClient.query.mockResolvedValueOnce(); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'w-1', status: 'pending' }] }); // get withdrawal
    // no balance update for success
    mockClient.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'w-1', status: 'success' }] }); // update withdrawal
    mockClient.query.mockResolvedValueOnce(); // COMMIT

    const result = await service.updateWithdrawalStatusAtomic('w-1', 'success');
    expect(result.status).toBe('success');
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
  });
});
