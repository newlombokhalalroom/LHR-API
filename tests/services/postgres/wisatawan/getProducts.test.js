import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductsService from '../../../../src/services/postgres/ProductsService.js';

let mockPool;

describe('ProductsService :: getProducts', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new ProductsService();
    vi.spyOn(service, 'getProductsDetailByProductId').mockResolvedValue({ details: 'fake-detail' });
    vi.clearAllMocks();
  });

  it('TCW-1A - Parameter pencarian valid', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'prod-1', client_id: 'client-1' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '1' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '1' }] });

    const result = await service.getProducts({ page: 1, limit: 10 });

    expect(result.result).toBeDefined();
    expect(result.result[0].id).toBe('prod-1');
  });

  it('TCW-1B - Parameter pencarian menghasilkan data kosong', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '0' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '0' }] });

    await expect(service.getProducts({ page: 1, limit: 10 })).rejects.toThrow('products not found');
  });
});
