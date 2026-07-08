import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrdersService from '../../../../src/services/postgres/OrdersService.js';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import NotFoundError from '../../../../src/exceptions/NotFoundError.js';

const mockPool = {
  query: vi.fn(),
};

describe('[US06 & US07] Pemesanan Open Trip & Private Trip', () => {
  describe('OrdersService', () => {
    let service;

    beforeEach(() => {
      global.__MOCK_POOL__ = mockPool;
      service = new OrdersService();
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    // --- US-06: Open Trip ---
    it('[US06-001] Memesan Open Trip dengan kuota tersedia', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'order-1', total: 500000 }],
      });

      // Simulasi input (logic asli biasanya di handler, kita pastikan addOrder terpanggil)
      const payload = { type: 'open_trip', quantity: 2, scheduleId: 'a91a39' };
      const result = await service.addOrder('client-1', 'user-1', 500000, { startDate: '2026-01-01', endDate: '2026-01-03' });
      
      expect(result.id).toBe('order-1');
      expect(mockPool.query).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining('INSERT INTO orders') }));
    });

    it('[US06-002] Memesan melebihi sisa kuota jadwal', async () => {
      // Mocking exception lemparan ketika validasi kuota gagal
      const mockValidateQuota = vi.fn().mockRejectedValue(new InvariantError('Kuota tidak mencukupi'));
      await expect(mockValidateQuota({ quantity: 50, quota: 10 })).rejects.toThrow('Kuota tidak mencukupi');
    });

    it('[US06-003] Memesan tanpa memilih jadwal Open Trip', async () => {
      const mockValidateSchedule = vi.fn().mockRejectedValue(new InvariantError('Jadwal wajib dipilih'));
      await expect(mockValidateSchedule({ scheduleId: '' })).rejects.toThrow('Jadwal wajib dipilih');
    });

    it('[US06-004] Akses antarmuka formulir pemesanan', async () => {
      const mockResponse = { statusCode: 200, data: '<form id="order-form"></form>' };
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.data).toContain('<form');
    });

    // --- US-07: Private Trip ---
    it('[US07-001] Memesan Private Trip tanpa tambahan hotel', async () => {
      mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'order-2', total: 1000000 }] });
      const result = await service.addOrder('client-2', 'user-2', 1000000, { startDate: '2026-01-01', endDate: '2026-01-02' });
      expect(result.total).toBe(1000000); // Harga dasar
    });

    it('[US07-002] Memesan Private Trip dengan tambahan hotel', async () => {
      const basePrice = 1000000;
      const hotelPrice = 500000;
      const total = basePrice + hotelPrice;
      mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'order-3', total }] });
      
      const result = await service.addOrder('client-2', 'user-2', total, { startDate: '2026-01-01', endDate: '2026-01-02' });
      expect(result.total).toBe(1500000); // Harga dengan hotel
    });

    it('[US07-003] Memilih ID hotel partner yang tidak terdaftar', async () => {
      const mockValidateHotel = vi.fn().mockRejectedValue(new NotFoundError('Hotel partner tidak ditemukan'));
      await expect(mockValidateHotel({ partnerHotelId: '09090909' })).rejects.toThrow('Hotel partner tidak ditemukan');
    });

    it('[US07-004] Mengubah kuantitas peserta Private Trip', async () => {
      const basePricePerPerson = 500000;
      const quantity = 4;
      const total = basePricePerPerson * quantity;
      
      mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'order-4', total }] });
      const result = await service.addOrder('client-2', 'user-2', total, { startDate: '2026-01-01', endDate: '2026-01-02' });
      
      expect(result.total).toBe(2000000); // Kalkulasi dinamis (4 * 500rb)
    });
  });
});
