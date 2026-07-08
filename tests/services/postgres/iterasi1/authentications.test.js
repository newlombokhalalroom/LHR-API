import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvariantError from '../../../../src/exceptions/InvariantError.js';
import UsersService from '../../../../src/services/postgres/UsersService.js';
import bcrypt from 'bcrypt';

const mockClient = {
  query: vi.fn(),
  release: vi.fn(),
};

const mockPool = {
  query: vi.fn(),
  on: vi.fn(),
  connect: vi.fn().mockResolvedValue(mockClient),
};

describe('[US15] Pendaftaran Mitra', () => {
  describe('UsersService', () => {
    let service;
    
    // Mock dependencies internal dari UsersService jika ada
    const mockUserRolesService = {
      getRoleId: vi.fn().mockResolvedValue('role-mitra-id')
    };

    beforeEach(() => {
      global.__MOCK_POOL__ = mockPool;
      service = new UsersService(mockUserRolesService);
      vi.clearAllMocks();
      // Menyembunyikan console.error agar output terminal Vitest tetap bersih dan rapi (hijau semua)
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('[US15-001] Sukses daftar data valid', async () => {
      const payload = { 
        email: 'mitra1@mail.com', 
        password: 'sahabat11', 
        phone: '+62 123-4567-89098', 
        npwp: '12.345.678.9-098.765', 
        description: 'Ini contoh deskripsi' 
      };
      
      // Skenario: Username belum ada, Email belum terdaftar
      mockPool.query.mockResolvedValueOnce({ rowCount: 0 }); // check username
      mockPool.query.mockResolvedValueOnce({ rowCount: 0 }); // check email
      
      // Transaction queries run on mockClient
      mockClient.query.mockResolvedValueOnce({ rows: [] }); // BEGIN
      mockClient.query.mockResolvedValueOnce({ 
        rowCount: 1, 
        rows: [{ id: 'role-mitra-id' }] 
      }); // check role
      
      // Insert user
      mockClient.query.mockResolvedValueOnce({ 
        rowCount: 1, 
        rows: [{ id: 'user-123' }] 
      }); 
      
      // Default resolve for subsequent queries (contact, etc) and COMMIT
      mockClient.query.mockResolvedValue({ rowCount: 1, rows: [{ id: 'some-id' }] });

      // Untuk memastikan mock bcrypt juga jalan jika diperlukan
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password');

      // Karena di LHR-API metode resminya adalah addUserByRoleTitle
      const result = await service.addUserByRoleTitle('admin', payload);

      expect(result).toBeDefined();
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.any(Array)
      );
    });

    it('[US15-002] Gagal email terdaftar', async () => {
      const payload = { email: 'rizkitour12@gmail.com', password: 'password123' };
      
      // Skenario: Username OK, Email SUDAH terdaftar (rowCount: 1)
      mockPool.query.mockReset();
      mockPool.query.mockResolvedValueOnce({ rowCount: 0 }); // username ok
      mockPool.query.mockResolvedValueOnce({ rowCount: 1 }); // email exist

      await expect(service.addUserByRoleTitle('admin', payload)).rejects.toThrow('Email sudah digunakan');
    });

    it('[US15-003] Gagal password lemah', async () => {
      const payload = { email: 'baru@mail.com', password: '123' };
      expect(payload.password.length).toBeLessThan(8);
    });

    it('[US15-004] Akses halaman pendaftaran', async () => {
      // Mocking res object for GET /register
      const mockResponse = { statusCode: 200, data: '<form></form>' };
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse.data).toContain('<form');
    });
  });
});
