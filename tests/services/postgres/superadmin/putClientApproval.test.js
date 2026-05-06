import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClientsService from '../../../../src/services/postgres/ClientsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('ClientsService :: putClientApproval', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ClientsService();
    vi.clearAllMocks();
  });

  it('TCS-4A - ID client tersedia dalam database', async () => {
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 'client-1' }],
    });

    const result = await service.putClientApproval('admin-1', 'client-1');
    expect(result).toBeUndefined();
  });

  it('TCS-4B - ID client tidak tersedia dalam database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(service.putClientApproval('admin-1', 'client-not-found'))
      .rejects.toThrow('Failed to approve client');
  });
});
