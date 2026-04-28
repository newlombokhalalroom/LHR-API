import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import ProductsService from '../../../../src/services/postgres/ProductsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('ProductsService :: deleteProduct', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ProductsService();
    vi.clearAllMocks();
  });

  it('TCM-3A - ID product tersedia dalam database', async () => {
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [{ id: 'prod-1' }],
    });

    const result = await service.deleteProduct('prod-1');
    expect(result).toEqual({ id: 'prod-1' });
  });

  it('TCM-3B - ID product tidak tersedia dalam database', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });

    await expect(service.deleteProduct('prod-not-found')).rejects.toThrow('Failed to delete this product');
  });
});
