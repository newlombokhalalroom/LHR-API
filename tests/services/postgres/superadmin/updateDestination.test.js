import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotFoundError from '../../../../src/exceptions/NotFoundError.js';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import DestinationsService from '../../../../src/services/postgres/DestinationsService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('DestinationsService :: updateDestination', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new DestinationsService();
    vi.clearAllMocks();
  });

  it('TCS-1A - ID destinasi tersedia dalam database dan data pembaruan valid', async () => {
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ title: 'Lama', coordinate: { x: 115, y: 8 } }],
    });
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 1, title: 'Baru' }],
    });

    const result = await service.updateDestination(1, { title: 'Baru' });
    expect(result.title).toBe('Baru');
  });

  it('TCS-1B - ID destinasi tidak tersedia dalam database', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(service.updateDestination(999, {})).rejects.toThrow('Destination not found');
  });

  it('TCS-1C - ID destinasi tersedia namun data pembaruan tidak memenuhi ketentuan', async () => {
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ title: 'Lama', coordinate: { x: 115, y: 8 } }],
    });
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(service.updateDestination(1, {})).rejects.toThrow('Failed to update destination');
  });

  it('TCS-1D - ID destinasi tersedia namun data pembaruan tidak valid', async () => {
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ title: 'Lama', coordinate: { x: 115, y: 8 } }],
    });
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 1, title: 'Invalid', latitude: -100, longitude: 200 }],
    });

    const result = await service.updateDestination(1, { latitude: -100, longitude: 200 });
    expect(result.latitude).toBe(-100);
    expect(result.longitude).toBe(200);
  });
});
