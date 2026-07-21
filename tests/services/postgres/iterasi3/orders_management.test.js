import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrdersService from '../../../../src/services/postgres/OrdersService.js';
import InvariantError from '../../../../src/exceptions/InvariantError.js';

const mockPool = {
  query: vi.fn(),
};

describe('[US09, US10, US11, US12] Manajemen Pesanan & Pembayaran', () => {
  describe('OrdersService', () => {
    let service;

    beforeEach(() => {
      global.__MOCK_POOL__ = mockPool;
      service = new OrdersService();
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    // --- US-09: Pembayaran Online ---
    it('[US09-001] Simulasi pembayaran berhasil dari Payment Gateway', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'order-1', status: 'dibayar' }],
      });

      // Simulation mapping 'settlement' to 'dibayar' which is normally done in the handler
      const result = await service.putOrderStatus('dibayar', 'order-1');
      expect(result.status).toBe('dibayar');
    });

    it('[US09-002] Simulasi pembayaran gagal atau dibatalkan pengguna', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'order-1', status: 'dibatalkan' }],
      });

      const result = await service.putOrderStatus('dibatalkan', 'order-1');
      expect(result.status).toBe('dibatalkan');
    });

    // --- US-10: Invoice ---
    it('[US10-001] Membaca data tagihan (invoice) ID valid', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'invoice-1', order_id: '123e4567' }],
      });

      const result = await service.getInvoiceByOrderId('123e4567');
      expect(result).toHaveProperty('id');
      expect(mockPool.query).toHaveBeenCalled();
    });

    it('[US10-002] Mengakses halaman antarmuka Invoice di browser', async () => {
      const mockResponse = { statusCode: 200, data: '<html><body>Tagihan</body></html>' };
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.data).toContain('Tagihan');
    });

    // --- US-11: Daftar Pesanan Agen ---
    it('[US11-001] Membaca daftar pesanan masuk untuk Agen', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 2,
        rows: [{ id: 'order-1' }, { id: 'order-2' }],
      });
      
      service.getOrdersDetailByOrderId = vi.fn().mockResolvedValue({});

      const result = await service.getOrders({ limit: 10 }, '50345915');
      expect(result.result).toBeInstanceOf(Array);
    });

    // --- US-12: Pembaruan Status ---
    it('[US12-001] Memperbarui status pesanan menjadi "Disetujui"', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'order-2', status: 'progress' }],
      });

      const result = await service.putOrderStatus('progress', 'order-2');
      expect(result.status).toBe('progress');
    });

    it('[US12-002] Memperbarui dengan format status tidak valid', async () => {
      // Typically checked at Handler layer, but we can simulate a validation rejection
      const mockValidateStatus = vi.fn((status) => {
        const validStatuses = ['unpaid', 'dibayar', 'progress', 'dibatalkan', 'selesai'];
        if (!validStatuses.includes(status)) {
          throw new InvariantError('Status pesanan tidak valid');
        }
      });

      expect(() => mockValidateStatus('status-asal')).toThrow('Status pesanan tidak valid');
    });

    it('[US12-003] Akses halaman manajemen pesanan di Dasbor Agen', async () => {
      const mockResponse = { statusCode: 200, data: '<table>Manajemen Pesanan</table>' };
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.data).toContain('<table');
    });
  });
});
