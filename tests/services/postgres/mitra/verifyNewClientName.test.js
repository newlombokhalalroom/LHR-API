import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import ClientsService from '../../../../src/services/postgres/ClientsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('ClientsService :: verifyNewClientName', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ClientsService();
    vi.clearAllMocks();
  });

  it('TCM-11A - Nama baru mitra belum ada di database', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });

  });

  it('TCM-11B - Nama baru mitra sudah ada di database', async () => {
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [{ name: 'Existing Name' }],
    });

    await expect(service.verifyNewClientName('Existing Name')).rejects.toThrow('Clients name already exists');
  });
});
