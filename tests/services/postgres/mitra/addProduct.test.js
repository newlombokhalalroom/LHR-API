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

describe('ProductsService :: addProduct', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ProductsService();
    vi.clearAllMocks();
  });

  it('TCM-1A - ID client valid dan data produk lengkap', async () => {
    const fakeProduct = { id: 'prod-1', title: 'Product 1', description: 'Desc 1', availability: true, price: 100, units: 5 };
    mockClient.query.mockResolvedValueOnce({ rows: [] }); // BEGIN
    mockClient.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [fakeProduct],
    }); // INSERT
    mockClient.query.mockResolvedValueOnce({ rows: [] }); // COMMIT

    const result = await service.addProduct('client-1', fakeProduct);

    expect(result).toEqual(fakeProduct);
    expect(mockClient.query).toHaveBeenCalledWith(expect.objectContaining({
      text: expect.stringContaining('INSERT INTO products'),
    }));
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('TCM-1B - ID client valid namun data produk tidak memenuhi ketentuan', async () => {
    mockClient.query.mockResolvedValueOnce({ rows: [] }); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // INSERT
    mockClient.query.mockResolvedValueOnce({ rows: [] }); // ROLLBACK

    await expect(service.addProduct('client-1', {})).rejects.toThrow('Failed to add product');
    expect(mockClient.release).toHaveBeenCalled();
  });
});