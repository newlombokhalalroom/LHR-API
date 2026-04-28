import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import ClientsService from '../../../../src/services/postgres/ClientsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('ClientsService :: updateClient', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ClientsService();
    vi.clearAllMocks();
  });

  it('TCM-10A - ID owner valid', async () => {
    const fakeClient = { id: 'client-1', owner_id: 'owner-1', name: 'Updated Name' };
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [fakeClient],
    });

    const result = await service.updateClient('owner-1', 'type-1', { name: 'Updated Name' });
    expect(result).toEqual(fakeClient);
  });

  it('TCM-10B - ID owner tidak ditemukan di database', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });
    await expect(service.updateClient('owner-not-found', 'type-1', {}))
      .rejects.toThrow('Failed to update client');
  });
});
