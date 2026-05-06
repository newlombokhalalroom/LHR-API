import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import ClientTypesService from '../../../../src/services/postgres/ClientTypesService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('ClientTypesService :: deleteClientType', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ClientTypesService();
    vi.clearAllMocks();
  });

  it('TCS-12A - ID tipe klien tersedia dalam database', async () => {
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 'type-1' }],
    });

    await expect(service.deleteClientType('type-1')).resolves.not.toThrow();
  });

  it('TCS-12B - ID tipe klien tidak tersedia dalam database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(service.deleteClientType('type-not-found'))
      .rejects.toThrow('Failed to delete client type. ID not found');
  });
});
