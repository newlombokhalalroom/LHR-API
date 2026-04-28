import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrdersService from '../../../../src/services/postgres/OrdersService.js';

let mockPool;

describe('OrdersService :: calculateOrderPrice', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new OrdersService();
    vi.clearAllMocks();
  });

  it('TCW-10A - Data "productItem" berisi item pesanan dengan nilai "total"', () => {
    const productItem = [
      { id: 'item-1', total: 100 },
      { id: 'item-2', total: 200 }
    ];
    // This is synchronous typically, or mock if needed. Let's assume it loops and sums.
    const result = service.calculateOrderPrice(productItem);
    expect(result).toBe(300);
  });
});
