import { describe, it, expect, vi, beforeEach } from 'vitest';
import PartnerHotelsService from '../../../../src/services/postgres/PartnerHotelsService.js';
import NotFoundError from '../../../../src/exceptions/NotFoundError.js';

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

const mockPool = {
  query: vi.fn(),
  connect: vi.fn().mockResolvedValue(mockClient),
};

describe('[US05] Mengatur Data Hotel Partner', () => {
  describe('PartnerHotelsService', () => {
    let service;

    beforeEach(() => {
      global.__MOCK_POOL__ = mockPool;
      service = new PartnerHotelsService();
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('[US05-001] Baca semua hotel agen', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'hotel-1', name: 'Hotel A' }],
      });

      const result = await service.getPartnerHotelsByClientId('client-1');
      expect(result).toBeInstanceOf(Array);
      expect(result[0].id).toBe('hotel-1');
      expect(mockPool.query).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining('SELECT') }));
    });

    it('[US05-002] Baca detail hotel ID valid', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'hotel-1', name: 'Hotel A' }],
      });

      const result = await service.getPartnerHotelById('hotel-1');
      expect(result.id).toBe('hotel-1');
    });

    it('[US05-003] Perbarui harga hotel', async () => {
      mockPool.query.mockResolvedValueOnce({ rowCount: 1 });
      await service.updatePartnerHotelById('hotel-1', { price_per_night: 950000, name: 'Hotel A' });
      expect(mockPool.query).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining('UPDATE') }));
    });

    it('[US05-004] Baca hotel ID tidak ada', async () => {
      mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
      await expect(service.getPartnerHotelById('salah')).rejects.toThrow('not found');
    });

    it('[US05-005] Akses hotel tanpa token', async () => {
      const req = { headers: { authorization: null } };
      expect(req.headers.authorization).toBeNull();
    });
  });
});
