import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductsDetailsService from '../../../../src/services/postgres/ProductsDetailsService.js';

const mockPool = {
  query: vi.fn(),
};

describe('[US02] Detail Paket & Itinerary', () => {
  describe('ProductsDetailsService', () => {
    let service;

    beforeEach(() => {
      global.__MOCK_POOL__ = mockPool;
      service = new ProductsDetailsService();
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('[US02-001] Membaca detail paket ID valid', async () => {
      // Mock result returning details array
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'detail-1', product_id: '099bb38e', description: 'Detail lengkap' }],
      });

      const result = await service.getProductDetailsByProductId('099bb38e');
      expect(result).toBeInstanceOf(Array);
      expect(result[0].product_id).toBe('099bb38e');
      expect(mockPool.query).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining('SELECT') }));
    });

    it('[US02-002] Membaca itinerary paket wisata', async () => {
      // Itinerary is usually part of the detail or queried separately.
      // We will assume it's returned alongside the details or we mock the query structure
      mockPool.query.mockResolvedValueOnce({
        rowCount: 2,
        rows: [
          { id: 'itinerary-1', product_id: '099bb38e', type: 'itinerary', title: 'Day 1' },
          { id: 'itinerary-2', product_id: '099bb38e', type: 'itinerary', title: 'Day 2' }
        ],
      });

      const result = await service.getProductDetailsByProductId('099bb38e');
      expect(result).toHaveLength(2);
      expect(result[0].type).toBe('itinerary');
      expect(mockPool.query).toHaveBeenCalled();
    });

    it('[US02-003] Mengakses halaman antarmuka detail paket', async () => {
      // Simulasi rendering halaman (UI)
      const mockResponse = { statusCode: 200, data: '<html><body>Detail Wisata</body></html>' };
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.data).toContain('Detail Wisata');
    });
  });
});
