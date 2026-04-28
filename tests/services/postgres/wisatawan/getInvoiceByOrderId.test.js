import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrdersService from '../../../../src/services/postgres/OrdersService.js';

let mockPool;

describe('OrdersService :: getInvoiceByOrderId', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new OrdersService();
    vi.spyOn(service, 'getOrdersDetailByOrderId').mockResolvedValue({});
    vi.clearAllMocks();
  });

  it('TCW-6A - ID order tersedia dalam database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'order-1', client_id: 'client-1', client_name: 'A' }] });
    const result = await service.getInvoiceByOrderId('order-1');
    expect(result).toBeDefined();
  });

  it('TCW-6B - ID order tidak tersedia dalam database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    await expect(service.getInvoiceByOrderId('invalid-id')).rejects.toThrow('No invoce has been found'); // keeping typo as in source
  });
});
