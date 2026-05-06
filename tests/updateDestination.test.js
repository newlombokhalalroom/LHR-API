import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError } from '../src/exceptions/NotFoundError.js';
import { InvariantError } from '../src/exceptions/InvariantError.js';
import DestinationsService from '../src/services/postgres/DestinationsService.js';

describe('DestinationsService :: updateDestination', () => {
  let service;
  let mockPool;

  beforeEach(() => {
    // 1. Mock pool dengan spyOn
    mockPool = {
      query: vi.fn(),
    };

    // 2. Buat instance service ASLI, tapi override _pool
    service = new DestinationsService();
    service._pool = mockPool; // Inject mock pool ke service

    vi.clearAllMocks();
  });

  it('TC-1A - Berhasil update destination', async () => {
    // Mock SELECT old data (rowCount: 1)
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          title: 'Bali Lama',
          description: 'Pantai indah',
          category: 'beach',
          address: 'Kuta',
          city: 'Denpasar',
          province: 'Bali',
          coordinate: { x: 115.1, y: 8.4 },
        },
      ],
    });

    // Mock UPDATE berhasil
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          id: 1,
          title: 'Bali Baru',
          longitude: 115.2,
          latitude: 8.5,
        },
      ],
    });

    const result = await service.updateDestination(1, {
      title: 'Bali Baru',
      latitude: 8.5,
      longitude: 115.2,
    });

    expect(mockPool.query).toHaveBeenCalledTimes(2);
    expect(result.title).toBe('Bali Baru');
    expect(result.latitude).toBe(8.5);
  });

  it('TC-1B - Destination tidak ditemukan', async () => {
    // Mock SELECT gagal (rowCount: 0)
    mockPool.query.mockResolvedValueOnce({
      rowCount: 0,
    });

    await expect(service.updateDestination(999, { title: 'Bali' })).rejects.toThrow(NotFoundError);

    expect(mockPool.query).toHaveBeenCalledTimes(1);
  });

  it('TC-1C - Gagal update destination', async () => {
    // Mock SELECT berhasil
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          title: 'Bali Lama',
          coordinate: { x: 115.1, y: 8.4 },
        },
      ],
    });

    // Mock UPDATE gagal (rowCount: 0)
    mockPool.query.mockResolvedValueOnce({
      rowCount: 0,
    });

    await expect(service.updateDestination(1, { title: 'Bali' })).rejects.toThrow(InvariantError);

    expect(mockPool.query).toHaveBeenCalledTimes(2);
  });
});
