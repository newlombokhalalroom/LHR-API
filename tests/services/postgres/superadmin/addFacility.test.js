import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import FacilitiesService from '../../../../src/services/postgres/FacilitiesService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('FacilitiesService :: addFacility', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new FacilitiesService();
    vi.clearAllMocks();
  });

  it('TCS-9A - Data fasilitas valid', async () => {
    const fakeFacility = { id: 'facility-1' };
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [fakeFacility],
    });

    // signature is addFacility(type_id, { title, category })
    const result = await service.addFacility('type-1', { title: 'WIFI', category: 'cat-1' });
    expect(result).toBeDefined(); 
  });

  it('TCS-9B - Proses penyimpanan fasilitas gagal', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(service.addFacility('type-1', { title: 'WIFI', category: 'cat-1' }))
      .rejects.toThrow('Failed to add facility');
  });
});
