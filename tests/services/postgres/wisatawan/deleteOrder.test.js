import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrdersService from '../../../../src/services/postgres/OrdersService.js';

let mockPool;

describe('OrdersService :: deleteOrder', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new OrdersService();
    vi.clearAllMocks();
  });

  it('TCW-8A - ID order tersedia dalam database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'order-1' }] });
    const result = await service.deleteOrder('order-1');
    expect(result.id).toBe('order-1');
  });

  it('TCW-8B - ID order tidak tersedia dalam database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    await expect(service.deleteOrder('invalid-id')).rejects.toThrow('Failed to delete order');
  });
});
