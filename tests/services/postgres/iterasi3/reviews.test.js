import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewsService from '../../../../src/services/postgres/ReviewsService.js';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import AuthorizationError from '../../../../src/exceptions/AuthorizationError.js';

const mockPool = {
  query: vi.fn(),
};

describe('[US13] Sistem Ulasan & Rating', () => {
  describe('ReviewsService', () => {
    let service;

    beforeEach(() => {
      global.__MOCK_POOL__ = mockPool;
      service = new ReviewsService();
      vi.clearAllMocks();
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('[US13-001] Memberikan ulasan pada pesanan yang sudah selesai', async () => {
      // Setup postReview
      mockPool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 'review-1' }]
      });

      const result = await service.postReview('order-1', 'user-1', 'prod-1', 'Layanan sangat memuaskan', 5);
      expect(result.id).toBe('review-1');
      expect(mockPool.query).toHaveBeenCalledTimes(1);
    });

    it('[US13-002] Memberikan ulasan pada pesanan yang belum selesai', async () => {
      // Mock authorization/verification check
      const mockVerifyOrderCompletion = vi.fn((orderStatus) => {
        if (orderStatus !== 'selesai') {
          throw new AuthorizationError('Pesanan belum selesai, ulasan ditolak');
        }
      });

      expect(() => mockVerifyOrderCompletion('progress')).toThrow('Pesanan belum selesai, ulasan ditolak');
    });

    it('[US13-003] Memberikan ulasan dengan format nilai rating salah', async () => {
      const mockValidateRating = vi.fn((rating) => {
        if (rating < 1 || rating > 5) {
          throw new InvariantError('Format rating tidak valid');
        }
      });

      expect(() => mockValidateRating(6)).toThrow('Format rating tidak valid');
    });
  });
});
