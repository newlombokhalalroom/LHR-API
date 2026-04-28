import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import ProductsPoliciesService from '../../../../src/services/postgres/ProductPoliciesService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('ProductsPoliciesService :: addProductPolicies', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new ProductsPoliciesService();
    vi.clearAllMocks();
  });

  it('TCM-12A - Data policies berhasil ditambahkan ke produk', async () => {
    const fakePolicy = [{ id: 'pol-1', details: 'Detail 1' }];
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: fakePolicy,
    });

    const result = await service.addProductPolicies('prod-1', fakePolicy);
    expect(result).toEqual(fakePolicy);
  });

  it('TCM-12B - Data policies tidak berhasil ditambahkan ke produk', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });
    await expect(service.addProductPolicies('prod-1', [{ id: 'pol-1', details: 'Detail' }]))
      .rejects.toThrow("Failed to add product's policies");
  });
});
