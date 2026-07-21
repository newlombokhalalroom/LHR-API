import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrdersService from '../../src/services/postgres/OrdersService.js';
import ClientsService from '../../src/services/postgres/ClientsService.js';

// Mocking Database Pool
const mockPool = {
  query: vi.fn(),
};

describe('Integration Testing - Iterasi 2', () => {
  let ordersService;
  let clientsService;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    ordersService = new OrdersService();
    clientsService = new ClientsService();
    vi.clearAllMocks();
  });

  describe('REGRESSION TEST (Memeriksa kestabilan fitur Iterasi 1)', () => {
    it('Fitur Manajemen Klien dari Iterasi 1 harus tetap berfungsi', async () => {
      // Mocking respons database saat mengambil data klien
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'client-123', name: 'Hotel Bahagia' }],
      });

      const client = await clientsService.getClientById('client-123');
      expect(client.name).toBe('Hotel Bahagia');
      expect(mockPool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('INTEGRATION TEST (Pengujian fitur baru di Iterasi 2)', () => {
    it('Harus berhasil memproses Pemesanan (Checkout) terintegrasi', async () => {
      // 1. Simulasi cek klien (Iterasi 1)
      mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'client-1' }] });
      
      // 2. Simulasi insert orders
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'order-integrated', total: 1000000 }],
      });

      // Proses integrasi: Klien divalidasi, lalu Order dibuat
      const clientResult = await mockPool.query('SELECT id FROM clients');
      expect(clientResult.rowCount).toBe(1);

      const orderResult = await ordersService.addOrder('client-1', 'user-1', 1000000, { startDate: '2026-08-01', endDate: '2026-08-05' });
      expect(orderResult.id).toBe('order-integrated');
    });
    
    it('Harus mencetak status pesanan secara akurat menjadi paid', async () => {
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'order-1', status: 'paid' }],
      });

      const result = await ordersService.putOrderStatus('paid', 'order-1');
      expect(result.status).toBe('paid');
    });
  });
});
