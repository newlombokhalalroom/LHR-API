import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import UnavailableStatusService from '../../../../src/services/postgres/UnavailableStatusService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('UnavailableStatusService :: addUnavailableStaus', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new UnavailableStatusService();
    service.verifyNewItemDates = vi.fn();
    vi.clearAllMocks();
  });

  it('TCM-9A - ID item dan data tanggal valid', async () => {
    service.verifyNewItemDates.mockResolvedValue();
    const fakeStatus = { id: 'status-1', item_id: 'item-1', start_date: '2023-01-01', end_date: '2023-01-05' };
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [fakeStatus],
    });

    const result = await service.addUnavailableStaus('item-1', { startDate: '2023-01-01', endDate: '2023-01-05' });
    expect(result).toEqual(fakeStatus);
  });

  it('TCM-9B - Proses penyimpanan data gagal', async () => {
    service.verifyNewItemDates.mockResolvedValue();
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });

    await expect(service.addUnavailableStaus('item-1', { startDate: '2023-01-01', endDate: '2023-01-05' })).rejects.toThrow('Failed to add unavailable status item');
  });
});
