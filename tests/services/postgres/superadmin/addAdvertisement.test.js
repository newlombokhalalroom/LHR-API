import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdvertisementsService from '../../../../src/services/postgres/AdvertisementsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('AdvertisementsService :: addAdvertisement', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new AdvertisementsService();
    vi.clearAllMocks();
  });

  it('TCS-6A - Data iklan valid', async () => {
    const fakeAd = { id: 'ad-1', title: 'Ad Title' };
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [fakeAd],
    });

    const result = await service.addAdvertisement({ title: 'Ad Title' });
    expect(result).toBeDefined();
  });
});
