import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import ProductsService from '../../../../src/services/postgres/ProductsService.js';

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
  connect: vi.fn().mockResolvedValue(mockClient),
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
    mockClient.query.mockResolvedValueOnce({ rows: [] }); // BEGIN
    mockClient.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 'prod-1', ...fakeUpdate }],
    }); // UPDATE
    mockClient.query.mockResolvedValueOnce({ rows: [] }); // COMMIT

    const result = await service.updateProductById('prod-1', fakeUpdate);

    expect(result).toEqual({ id: 'prod-1', ...fakeUpdate });
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('TCM-2B - ID product tidak tersedia dalam database', async () => {
    mockClient.query.mockResolvedValueOnce({ rows: [] }); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // UPDATE
    mockClient.query.mockResolvedValueOnce({ rows: [] }); // ROLLBACK

    await expect(service.updateProductById('prod-not-found', {}))
      .rejects.toThrow('Failed to update product');
    expect(mockClient.release).toHaveBeenCalled();
  });
});
