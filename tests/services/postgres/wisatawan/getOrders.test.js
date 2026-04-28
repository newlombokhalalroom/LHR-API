import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrdersService from '../../../../src/services/postgres/OrdersService.js';

let mockPool;

describe('OrdersService :: getOrders', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new OrdersService();
    vi.spyOn(service, 'getOrdersDetailByOrderId').mockResolvedValue({});
    vi.clearAllMocks();
  });

  it('TCW-7A - ID user atau client memiliki data pesanan', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'order-1' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '1' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '1' }] });

    const result = await service.getOrders({ page: 1, limit: 10 }, 'user-1');
    expect(result.result).toBeDefined();
  });

  it('TCW-7B - ID user atau client tidak memiliki data pesanan', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '0' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '0' }] });

    await expect(service.getOrders({ page: 1, limit: 10 }, 'invalid-id')).rejects.toThrow('orders not found');
  });
});
