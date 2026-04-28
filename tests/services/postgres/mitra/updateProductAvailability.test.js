import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import ProductsService from '../../../../src/services/postgres/ProductsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('ProductsService :: updateProductAvailability', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ProductsService();
    vi.clearAllMocks();
  });

  it('TCM-7A - ID product valid dan status ketidaktersediaan menjadi nilai baru', async () => {
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [{ id: 'prod-1', title: 'Product 1', availability: false }],
    });

    const result = await service.updateProductAvailability('prod-1', false);
    expect(result).toEqual({ id: 'prod-1', title: 'Product 1', availability: false });
  });

  it('TCM-7B - ID product tidak ditemukan di database', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });
    await expect(service.updateProductAvailability('prod-not-found', false))
      .rejects.toThrow('Failed to update product availability');
  });
});
