import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import DetailsService from '../../../../src/services/postgres/DetailsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('DetailsService :: updateDetailById', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new DetailsService();
    vi.clearAllMocks();
  });

  it('TCS-7A - ID detail tersedia dan minimal satu field diberikan', async () => {
    const fakeDetail = { id: 'detail-1', title: 'New Title' };
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [fakeDetail],
    });

    const result = await service.updateDetailById('detail-1', { title: 'New Title' });
    expect(result).toEqual(fakeDetail);
  });

  it('TCS-7B - Tidak ada field yang diberikan dalam payload', async () => {
    await expect(service.updateDetailById('detail-1', {})).rejects.toThrow('No valid fields to update');
  });

  it('TCS-7C - Field diberikan tetapi ID detail tidak tersedia dalam database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(service.updateDetailById('detail-not-found', { title: 'New Title' })).rejects.toThrow('Failed to update detail');
  });
});
