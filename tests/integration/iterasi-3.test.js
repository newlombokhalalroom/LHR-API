import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrdersService from '../../src/services/postgres/OrdersService.js';
import ProductsService from '../../src/services/postgres/ProductsService.js';
import ReviewsService from '../../src/services/postgres/ReviewsService.js';

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

const mockPool = {
  query: vi.fn(),
  connect: vi.fn().mockResolvedValue(mockClient),
};

describe('Integration Testing - Iterasi 3', () => {
  let ordersService;
  let productsService;
  let reviewsService;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    ordersService = new OrdersService();
    productsService = new ProductsService();
    reviewsService = new ReviewsService();
    vi.clearAllMocks();
  });

  describe('REGRESSION TEST (Memeriksa kestabilan fitur Iterasi 1 & 2)', () => {
    it('Sistem Transaksi dan Pemesanan (Iterasi 2) tidak boleh rusak oleh relasi Tour', async () => {
      // Mocking pembuatan order tipe rental (tanpa schedule_id / hotel_id)
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'order-rental', total: 500000 }],
      });

      const orderResult = await ordersService.addOrder('client-2', 'user-2', 500000, { startDate: '2026-09-01', endDate: '2026-09-02' });
      expect(orderResult.id).toBe('order-rental');
      expect(mockPool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('INTEGRATION TEST (Pengujian fitur baru di Iterasi 3)', () => {
    it('Harus berhasil mendaftarkan Paket Wisata terintegrasi (US-04 & US-05)', async () => {
      // Simulasi penambahan produk wisata dengan transaksi (client)
      mockClient.query.mockResolvedValueOnce({}); // BEGIN
      mockClient.query.mockResolvedValueOnce({    // INSERT product
        rowCount: 1,
        rows: [{ id: 'product-tour-1' }],
      });
      mockClient.query.mockResolvedValueOnce({}); // COMMIT

      const productPayload = {
        title: 'Trip 3 Gili',
        description: 'Liburan seru',
        price: 1500000,
        typeId: 'type-tour',
      };
      
      const result = await productsService.addProduct('client-1', productPayload);
      expect(result.id).toBe('product-tour-1');
    });

    it('Harus berhasil menangkap Ulasan dan Rating terintegrasi dengan Pesanan (US-13)', async () => {
      // Simulasi penambahan review ke database
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'review-1', review_rate: 5 }],
      });

      // 2. Simulasi pemanggilan fungsi reviewsService
      const reviewResult = await reviewsService.postReview(
        'order-1',           // order_id
        'user-1',            // user_id
        'product-1',         // product_id
        'Sangat memuaskan!', // review_content
        5                    // review_rate
      );
      expect(reviewResult.id).toBe('review-1');
      expect(mockPool.query).toHaveBeenCalledTimes(1);
    });
  });
});
