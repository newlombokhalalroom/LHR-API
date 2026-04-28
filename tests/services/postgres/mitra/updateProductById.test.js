import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import ProductsService from '../../../../src/services/postgres/ProductsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('ProductsService :: updateProductById', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ProductsService();
    vi.clearAllMocks();
  });

  it('TCM-2A - ID product tersedia dalam database dan data pembaruan valid', async () => {
    const fakeUpdate = { title: 'Updated', description: 'Desc', availability: false, price: 200, units: 2 };
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [{ id: 'prod-1', ...fakeUpdate }],
    });

    const result = await service.updateProductById('prod-1', fakeUpdate);

    expect(result).toEqual({ id: 'prod-1', ...fakeUpdate });
  });

  it('TCM-2B - ID product tidak tersedia dalam database', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });
    await expect(service.updateProductById('prod-not-found', {}))
      .rejects.toThrow('Failed to update product');
  });
});
