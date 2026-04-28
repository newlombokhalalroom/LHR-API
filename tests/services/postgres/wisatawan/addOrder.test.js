import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrdersService from '../../../../src/services/postgres/OrdersService.js';
import InvariantError from '../../../../src/exceptions/InvariantError.js';

let mockPool;

describe('OrdersService :: addOrder', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new OrdersService();
    vi.clearAllMocks();
  });

  it('TCW-3A - Data pemesanan valid', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'order-1' }] });

    const result = await service.addOrder('cd-1', 'ud-1', 1000, {
      startDate: '2023-01-01', 
      endDate: '2023-01-02'
    });

    expect(result).toBeDefined();
    expect(result.id).toBe('order-1');
  });

  it('TCW-3B - Data pemesanan gagal disimpan', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(service.addOrder('cd-1', 'ud-1', 1000, {
      startDate: '2023-01-01', 
      endDate: '2023-01-02'
    })).rejects.toThrow('Failed to add order');
  });
});
