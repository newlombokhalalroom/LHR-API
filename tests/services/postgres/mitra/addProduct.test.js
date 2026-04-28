import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import ProductsService from '../../../../src/services/postgres/ProductsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('ProductsService :: addProduct', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ProductsService();
    vi.clearAllMocks();
  });

  it('TCM-1A - ID client valid dan data produk lengkap', async () => {
    const fakeProduct = { id: 'prod-1', title: 'Product 1', description: 'Desc 1', availability: true, price: 100, units: 5 };
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [fakeProduct],
    });

    const result = await service.addProduct('client-1', fakeProduct);

    expect(result).toEqual(fakeProduct);
    expect(mockPool.query).toHaveBeenCalledWith(expect.objectContaining({
      text: expect.stringContaining('INSERT INTO products'),
    }));
  });

  it('TCM-1B - ID client valid namun data produk tidak memenuhi ketentuan', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });

    await expect(service.addProduct('client-1', {})).rejects.toThrow('Failed to add product');
  });
});