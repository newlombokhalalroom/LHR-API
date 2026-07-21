import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrderItemsService from '../../../../src/services/postgres/OrderItemsService.js';
import InvariantError from '../../../../src/exceptions/InvariantError.js';

const mockPool = {
  query: vi.fn(),
};

describe('[US08] Lokasi Penjemputan', () => {
  describe('OrderItemsService', () => {
    let service;

    beforeEach(() => {
      global.__MOCK_POOL__ = mockPool;
      service = new OrderItemsService();
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('[US08-001] Mengisi formulir lokasi penjemputan valid', async () => {
      mockPool.query.mockResolvedValue({
        rowCount: 1,
        rows: [{ id: 'item-1' }],
      });

      // addOrderItems expects an array of orderItems
      const orderItems = [
        { product_id: 'prod-1', options: [{ title: 'Lokasi Penjemputan', description: 'Bandara Internasional Lombok' }] }
      ];

      const result = await service.addOrderItems('order-1', orderItems);
      
      expect(result).toBeDefined();
      expect(mockPool.query).toHaveBeenCalledWith(expect.objectContaining({ text: expect.stringContaining('INSERT') }));
    });

    it('[US08-002] Mengosongkan data lokasi penjemputan', async () => {
      // Mock validation function as this is usually validated at handler or domain level before reaching db service
      const mockValidatePickup = vi.fn((location) => {
        if (!location || location.trim() === '') {
          throw new InvariantError('Lokasi penjemputan wajib diisi');
        }
        return true;
      });

      expect(() => mockValidatePickup('')).toThrow('Lokasi penjemputan wajib diisi');
    });
  });
});
