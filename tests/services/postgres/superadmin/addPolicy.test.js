import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import PoliciesSerive from '../../../../src/services/postgres/PoliciesSerive.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('PoliciesSerive :: addPolicy', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new PoliciesSerive();
    vi.clearAllMocks();
  });

  it('TCS-8A - Data kebijakan valid', async () => {
    const fakePolicy = { id: 'policy-1', title: 'Policy 1' };
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [fakePolicy],
    });

    // signature is addPolicy(typeId, { title, category, description })
    const result = await service.addPolicy('type-1', { title: 'Policy 1', category: 'cat-1', description: 'desc' });
    expect(result).toBeDefined();
  });

  it('TCS-8B - Proses penyimpanan kebijakan gagal', async () => {
    mockPool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

    await expect(service.addPolicy('type-1', { title: 'Policy 1', category: 'cat-1', description: 'desc' }))
      .rejects.toThrow('Failed to add policy');
  });
});
