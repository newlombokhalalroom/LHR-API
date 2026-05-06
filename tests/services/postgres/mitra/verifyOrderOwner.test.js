import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthorizationError from '../../../../src/exceptions/AuthorizationError.js';
import OrdersService from '../../../../src/services/postgres/OrdersService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('OrdersService :: verifyOrderOwner', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new OrdersService();
    vi.clearAllMocks();
  });

  it('TCM-6A - ID user memiliki hak akses terhadap order', async () => {
    mockPool.query.mockResolvedValue({
      rowCount: 1,
      rows: [{ id: 'order-1', owner_id: 'user-1' }],
    });

  });

  it('TCM-6B - ID user tidak memiliki hak akses terhadap order', async () => {
    mockPool.query.mockResolvedValue({ rowCount: 0, rows: [] });

    await expect(service.verifyOrderOwner('user-2', 'order-1')).rejects.toThrow('Forbidden access to this order');
  });
});
