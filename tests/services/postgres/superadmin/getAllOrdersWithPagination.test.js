import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrdersService from '../../../../src/services/postgres/OrdersService.js';

let mockPool;

describe('OrdersService :: getAllOrdersWithPagination', () => {
  let service;

  beforeEach(() => {
    mockPool = {
      query: vi.fn(),
      on: vi.fn(),
    };
    global.__MOCK_POOL__ = mockPool;
    service = new OrdersService();
  });

  it('TCS-11A - Database memiliki data orders', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'order-1' }] }); // Main query
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '1' }] }); // total

    const result = await service.getAllOrdersWithPagination({ page: 1, limit: 10 });
    expect(result.result).toBeDefined();
    expect(result.total).toBe(1);
  });

  it('TCS-11B - Database tidak memiliki data orders', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // Main query

    await expect(service.getAllOrdersWithPagination({ page: 1, limit: 10 }))
      .rejects.toThrow('No orders found');
  });
});
