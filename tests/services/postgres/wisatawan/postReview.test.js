import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewsService from '../../../../src/services/postgres/ReviewsService.js';

let mockPool;

describe('ReviewsService :: postReview', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new ReviewsService();
    vi.clearAllMocks();
  });

  it('TCW-4A - Data ulasan valid', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'review-1' }] });

    const result = await service.postReview({
      user_id: 'u-1', product_id: 'p-1', order_id: 'o-1', rate: 5, description: 'Good'
    });

    expect(result).toBeDefined();
    expect(result.id).toBe('review-1');
  });

  it('TCW-4B - Data ulasan gagal disimpan', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(service.postReview({
      user_id: 'u-1', product_id: 'p-1', order_id: 'o-1', rate: 5, description: 'Good'
    })).rejects.toThrow('Failed to add review');
  });
});
