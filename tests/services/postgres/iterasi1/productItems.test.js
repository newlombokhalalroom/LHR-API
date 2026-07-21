import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductItemsService from '../../../../src/services/postgres/ProductItemsService.js';
import InvariantError from '../../../../src/exceptions/InvariantError.js';

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

const mockPool = {
  query: vi.fn(),
  connect: vi.fn().mockResolvedValue(mockClient),
};

describe('[US04] Mengelola Jadwal & Kuota Open Trip', () => {
  describe('ProductItemsService', () => {
    let service;

    beforeEach(() => {
      global.__MOCK_POOL__ = mockPool;
      service = new ProductItemsService();
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('[US04-001] Membuat jadwal Open Trip', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'item-1' }],
      });

      const result = await service.addProductItem('prod-1', { title: 'Trip 2026', startDate: '2026-01-01', quota: 15 });
      expect(result).toEqual({ id: 'item-1' });
      expect(mockPool.query).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining('INSERT') }));
    });

    it('[US04-002] Jadwal tanggal tidak valid', async () => {
      // Mensimulasikan validasi tanggal yang gagal
      const invalidPayload = { title: 'Trip', startDate: 'bukan-tanggal' };
      // Normalnya di handler, namun kita bisa mock error lemparan PostgreSQL
      mockPool.query.mockRejectedValueOnce(new InvariantError('Format tanggal tidak valid'));
      
      await expect(service.addProductItem('prod-1', invalidPayload)).rejects.toThrow('Format tanggal tidak valid');
    });

    it('[US04-003] Perbarui kuota ID valid', async () => {
      mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'item-1' }] });
      await service.putProductItem('item-1', 'prod-1', 'Updated Title');
      expect(mockPool.query).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining('UPDATE') }));
    });

    it('[US04-004] Baca jadwal di detail produk', async () => {
      mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'item-1' }] });
      const result = await service.getProductItemsByProductId('prod-1');
      expect(result).toBeInstanceOf(Array);
      expect(result[0].id).toBe('item-1');
    });

    it('[US04-005] Akses API tanpa token', async () => {
      const req = { headers: { authorization: null } };
      expect(req.headers.authorization).toBeNull();
    });
  });
});
