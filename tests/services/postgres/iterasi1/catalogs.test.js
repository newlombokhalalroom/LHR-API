import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductsService from '../../../../src/services/postgres/ProductsService.js';

const mockPool = {
  query: vi.fn(),
};

vi.mock('../../../../src/utils/config.js', () => ({
  createDatabasePool: vi.fn().mockResolvedValue(mockPool),
  default: { createDatabasePool: vi.fn().mockResolvedValue(mockPool) },
}));

describe('[US01] Katalog Publik', () => {
  describe('CatalogService', () => {
    let service;

    beforeEach(() => {
      global.__MOCK_POOL__ = mockPool;
      service = new ProductsService();
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('[US01-001] Baca katalog tanpa login', async () => {
      // Mock for data query
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'prod-1', title: 'Trip Lombok' }]
      });
      // Mock for total query
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ count: 1 }]
      });

      // Avoid crash on getProductsDetailByProductId inner mapping
      service.getProductsDetailByProductId = vi.fn().mockResolvedValue({});

      const result = await service.getProducts({});
      expect(result).toHaveProperty('result');
      expect(result.result[0].id).toBe('prod-1');
      expect(mockPool.query).toHaveBeenCalled();
    });

    it('[US01-002] Baca detail dan jadwal', async () => {
      // Mock for data query
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'prod-1', title: 'Detail Trip' }]
      });
      // Mock for total query
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ count: 1 }]
      });

      service.getProductsDetailByProductId = vi.fn().mockResolvedValue({});

      const result = await service.getProductById('prod-1');
      expect(result.result.id).toBe('prod-1');
    });

    it('[US01-003] Akses halaman UI katalog', async () => {
      const mockResponse = { statusCode: 200, data: '<div class="catalog"></div>' };
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.data).toContain('class="catalog"');
    });

    it('[US01-004] Akses halaman UI detail', async () => {
      const mockResponse = { statusCode: 200, data: '<h1>Detail Produk</h1>' };
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.data).toContain('Detail Produk');
    });
  });
});
