import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvariantError } from '../src/exceptions/InvariantError.js';
import ProductsService from '../src/services/postgres/ProductsService.js'; // sesuaikan path

describe('ProductsService :: addProduct', () => {
  let service;
  let mockPool;

  beforeEach(() => {
    // 1. Mock pool dengan spyOn
    mockPool = {
      query: vi.fn(),
    };

    // 2. Buat instance service ASLI, tapi override _pool
    service = new ProductsService();
    service._pool = mockPool; // Inject mock pool ke service

    vi.clearAllMocks();
  });

  it('1A - Tambah produk berhasil', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 'prod1', title: 'Toyota Avanza' }],
      rowCount: 1,
    });

    const result = await service.addProduct('client1', {
      title: 'Toyota Avanza',
      description: 'Mobil family',
      availability: 5,
      price: 500000,
      units: 1,
    });

    expect(result.title).toBe('Toyota Avanza');
    expect(mockPool.query).toHaveBeenCalledTimes(1);
  });

  it('1B - Gagal tambah produk', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    await expect(service.addProduct('client1', { title: 'Duplicate' })).rejects.toThrow(
      InvariantError,
    );
    expect(mockPool.query).toHaveBeenCalledTimes(1);
  });
});
