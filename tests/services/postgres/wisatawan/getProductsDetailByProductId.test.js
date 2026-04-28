import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductsService from '../../../../src/services/postgres/ProductsService.js';

let mockPool;

describe('ProductsService :: getProductsDetailByProductId', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new ProductsService();
    vi.clearAllMocks();
  });

  const setupDefaultMocks = () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // amenities
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // pictures
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // details
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // items
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // policies
  };

  it('TCW-9A - ID product valid dan ID client tersedia', async () => {
    setupDefaultMocks();
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'client-1', name: 'Client A' }] }); // client
    const result = await service.getProductsDetailByProductId('prod-1', 'client-1');
    expect(result).toBeDefined();
    expect(result.client).toBeDefined();
  });

  it('TCW-9B - ID product valid dan ID client tidak diberikan', async () => {
    setupDefaultMocks();
    const result = await service.getProductsDetailByProductId('prod-1');
    expect(result).toBeDefined();
    expect(result.client).toEqual([]); // Source code returns [] if undefined
  });
});
