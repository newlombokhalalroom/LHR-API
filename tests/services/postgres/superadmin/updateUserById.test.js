import { describe, it, expect, vi, beforeEach } from 'vitest';
import UsersService from '../../../../src/services/postgres/UsersService.js';

let mockPool;
let mockClient;

describe('UsersService :: updateUserById', () => {
  let service;

  beforeEach(() => {
    mockPool = {
      query: vi.fn(),
      on: vi.fn(),
      connect: vi.fn(),
    };
    mockClient = {
      query: vi.fn(),
      release: vi.fn(),
    };
    global.__MOCK_POOL__ = mockPool;
    service = new UsersService();
    mockPool.connect.mockResolvedValue(mockClient);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('TCS-2A - Payload berisi "role_title" valid dan beberapa field user serta contact', async () => {
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'role-1' }] }); // Get role
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // Update users
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // Update contacts
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // COMMIT

    await service.updateUserById('user-1', { role_title: 'admin', fullname: 'Test', address: 'Home' });
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
  });

  it('TCS-2B - Payload berisi "role_title" yang tidak ditemukan dalam database', async () => {
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 0, rows: [] }); // Get role -> not found
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // ROLLBACK

    await expect(service.updateUserById('user-1', { role_title: 'invalid_role' }))
      .rejects.toThrow('Role');
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
  });

  it('TCS-2C - Payload hanya berisi field pada tabel "users"', async () => {
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // Update users
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // COMMIT

    await service.updateUserById('user-1', { fullname: 'Test' });
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
  });

  it('TCS-2D - Payload hanya berisi field pada tabel "contacts"', async () => {
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // BEGIN
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // Update contacts
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // COMMIT

    await service.updateUserById('user-1', { address: 'Home' });
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
  });

  it('TCS-2E - Terjadi kesalahan pada saat proses update', async () => {
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // BEGIN
    const dbError = new Error('DB Error');
    mockClient.query.mockRejectedValueOnce(dbError); // Fail update
    mockClient.query.mockResolvedValueOnce({ rowCount: 1 }); // ROLLBACK

    await expect(service.updateUserById('user-1', { fullname: 'Test' }))
      .rejects.toThrow(dbError);
    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
  });
});
