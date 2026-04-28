import { describe, it, expect, vi, beforeEach } from 'vitest';
import DestinationsService from '../../../../src/services/postgres/DestinationsService.js';

let mockPool;

describe('DestinationsService :: getAllDestinations', () => {
  let service;

  beforeEach(() => {
    mockPool = { query: vi.fn(), on: vi.fn() };
    global.__MOCK_POOL__ = mockPool;
    service = new DestinationsService();
    vi.clearAllMocks();
  });

  const setupSuccessMocks = () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'dest-1' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '1' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '1' }] });
  };

  it('TCW-5A - Tanpa parameter dan data tersedia', async () => {
    setupSuccessMocks();
    const result = await service.getAllDestinations();
    expect(result.result).toBeDefined();
  });

  it('TCW-5B - Parameter "city" diisi dan data tersedia', async () => {
    setupSuccessMocks();
    const result = await service.getAllDestinations({ city: 'Bandung' });
    expect(result.result).toBeDefined();
  });

  it('TCW-5C - Parameter "category" diisi dan data tersedia', async () => {
    setupSuccessMocks();
    const result = await service.getAllDestinations({ category: 'Nature' });
    expect(result.result).toBeDefined();
  });

  it('TCW-5D - Parameter "city" dan "category" diisi dan data tersedia', async () => {
    setupSuccessMocks();
    const result = await service.getAllDestinations({ city: 'Bandung', category: 'Nature' });
    expect(result.result).toBeDefined();
  });

  it('TCW-5E - Parameter menghasilkan data kosong', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '0' }] });
    mockPool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ count: '0' }] });

    await expect(service.getAllDestinations({ city: 'Unknown' })).rejects.toThrow('No destinations found');
  });
});
