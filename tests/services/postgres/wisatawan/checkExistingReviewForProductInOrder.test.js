import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewsService from '../../../../src/services/postgres/ReviewsService.js';

let mockPool;

describe('ReviewsService :: checkExistingReviewForProductInOrder', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new ReviewsService();
    vi.clearAllMocks();
  });

  it('TCW-11A - Data ulasan berdasarkan ID order dan ID product belum ada di database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    await expect(service.checkExistingReviewForProductInOrder('prod-1', 'order-1')).resolves.not.toThrow();
  });

  it('TCW-11B - Data ulasan berdasarkan ID order dan ID product sudah ada di database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'review-1' }] });
    await expect(service.checkExistingReviewForProductInOrder('prod-1', 'order-1')).rejects.toThrow('A review for this product related to this order already exists.');
  });
});
