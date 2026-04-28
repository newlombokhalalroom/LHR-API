import { describe, it, expect, vi, beforeEach } from 'vitest';
import NotFoundError from '../../../../src/exceptions/NotFoundError.js';
import DetailCategoriesService from '../../../../src/services/postgres/DetailCategoriesService.js';

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
};

describe('DetailCategoriesService :: getAllDetailCategories', () => {
  let service;

  beforeEach(() => {
    global.__MOCK_POOL__ = mockPool;
    service = new DetailCategoriesService();
    vi.clearAllMocks();
  });

  it('TCS-10A - Database berisi data kategori detail', async () => {
    const fakeCategories = [{ id: 'cat-1', title: 'Category 1' }];
    mockPool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: fakeCategories,
    });

    const result = await service.getAllDetailCategories();
    expect(result).toEqual(fakeCategories);
  });
});
