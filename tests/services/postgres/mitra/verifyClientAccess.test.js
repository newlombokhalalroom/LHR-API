import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthorizationError from '../../../../src/exceptions/AuthorizationError.js';
import ProductsService from '../../../../src/services/postgres/ProductsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('ProductsService :: verifyClientAccess', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ProductsService();
    vi.clearAllMocks();
  });

  it('TCM-8A - ID product dan ID client sesuai dengan data di database', async () => {
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [{ id: 'prod-1', client_id: 'client-1' }],
    });

  });

  it('TCM-8B - ID product dan ID client tidak sesuai atau tidak ditemukan di database', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });
    await expect(service.verifyClientAccess('prod-1', 'client-1'))
      .rejects.toThrow('Forbidden access to this product');
  });
});
