import { vi } from 'vitest';

// Global mock for pg module
vi.mock('pg', () => {
  const mPool = {
    query: vi.fn().mockResolvedValue({ rowCount: 0, rows: [] }),
    connect: vi.fn(),
    on: vi.fn(),
    end: vi.fn(),
  };
  return {
    Pool: vi.fn(() => mPool),
    Client: vi.fn(),
  };
});
