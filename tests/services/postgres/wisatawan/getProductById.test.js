import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductsService from '../../../../src/services/postgres/ProductsService.js';

let mockPool;

describe('ProductsService :: getProductById', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new ProductsService();
    vi.spyOn(service, 'getProductsDetailByProductId').mockResolvedValue({ extra: 'info' });
    vi.clearAllMocks();
  });

  it('TCW-2A - ID product valid dan tersedia di database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'prod-1', client_id: 'client-1' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '1' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '1' }] });

    const result = await service.getProductById('prod-1');

    expect(result.result).toBeDefined();
    expect(result.result.id).toBe('prod-1');
  });

  it('TCW-2B - ID product tidak tersedia di database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '0' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '0' }] });

    await expect(service.getProductById('invalid-id')).rejects.toThrow('products not found');
  });
});
