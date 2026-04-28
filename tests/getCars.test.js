import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError } from '../src/exceptions/NotFoundError.js';
import ProductsService from '../src/services/postgres/ProductsService.js'; // sesuaikan path

describe('ProductsService :: getCars', () => {
  let productsService;
  let mockPool;

  beforeEach(() => {
    // 1. Mock pool dengan spyOn
    mockPool = {
      query: vi.fn(),
    };

    // 2. Buat instance service ASLI, tapi override _pool
    productsService = new ProductsService();
    productsService._pool = mockPool; // Inject mock pool ke service

    vi.clearAllMocks();
  });

  /** P1: Tanpa filter */
  it('1A - Tanpa filter (semua if FALSE)', async () => {
    const options = {};

    // Mock main query
    mockPool.query
      .mockResolvedValueOnce({
        rows: [{ id: 'car1', client_id: 'client1' }],
        rowCount: 1,
      })
      // 3 enrich queries per row (details, pictures, client)
      .mockResolvedValueOnce({ rows: [{ id: 'detail1' }] }) // details
      .mockResolvedValueOnce({ rows: [{ id: 'pic1' }] }) // pictures
      .mockResolvedValueOnce({ rows: [{ id: 'client1', name: 'Rental Lombok' }] }); // client

    const result = await productsService.getCars(options);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('details');
    expect(result[0]).toHaveProperty('pictures');
    expect(result[0]).toHaveProperty('client');

    // Main query tanpa filter
    const mainQuery = mockPool.query.mock.calls[0][0];
    expect(mainQuery.text).toContain('WHERE 1 = 1');
    expect(mainQuery.values).toEqual([]); // no filter values
  });

  /** P2: Filter type */
  it('1B - Filter type saja', async () => {
    const options = { type: 'suv' };

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ id: 'car1', client_id: 'client1' }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [] }) // details
      .mockResolvedValueOnce({ rows: [] }) // pictures
      .mockResolvedValueOnce({ rows: [{ id: 'client1' }] }); // client

    await expect(productsService.getCars(options)).resolves.not.toThrow();

    const mainQuery = mockPool.query.mock.calls[0][0];
    expect(mainQuery.text).toContain('c.type_id IN');
    expect(mainQuery.values).toEqual(['suv']);
  });

  /** P3: Filter city */
  it('1C - Filter city saja', async () => {
    const options = { city: 'Mataram' };

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ id: 'car1' }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 'client1' }] });

    await expect(productsService.getCars(options)).resolves.not.toThrow();

    const mainQuery = mockPool.query.mock.calls[0][0];
    expect(mainQuery.text).toContain('l.city =');
    expect(mainQuery.values).toEqual(['Mataram']);
  });

  /** P4: Filter tanggal */
  it('1D - Filter startDate + endDate', async () => {
    const options = { startDate: '2026-02-10', endDate: '2026-02-12' };

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ id: 'car1' }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 'client1' }] });

    await expect(productsService.getCars(options)).resolves.not.toThrow();

    const mainQuery = mockPool.query.mock.calls[0][0];
    expect(mainQuery.text).toContain('pi.id NOT IN');
    expect(mainQuery.values).toEqual(['2026-02-10', '2026-02-12']);
  });

  /** P5: Filter amenity */
  it('1E - Filter amenity', async () => {
    const options = { amenity: 'AC' };

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ id: 'car1' }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 'client1' }] });

    await expect(productsService.getCars(options)).resolves.not.toThrow();

    const mainQuery = mockPool.query.mock.calls[0][0];
    expect(mainQuery.text).toContain('pa.amenity_id IN');
    expect(mainQuery.values).toEqual(['AC']);
  });

  /** P6: Filter detail */
  it('1F - Filter detailTitle + detailAmount', async () => {
    const options = { detailTitle: 'Kapasitas', detailAmount: 4 };

    mockPool.query
      .mockResolvedValueOnce({ rows: [{ id: 'car1' }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 'client1' }] });

    await expect(productsService.getCars(options)).resolves.not.toThrow();

    const mainQuery = mockPool.query.mock.calls[0][0];
    expect(mainQuery.text).toContain('d.title =');
    expect(mainQuery.values).toEqual(['Kapasitas', 4]);
  });

  /** P7: Throw NotFoundError */
  it('1G - Throw NotFoundError (rowCount = 0)', async () => {
    const options = { type: 'suv' };

    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    await expect(productsService.getCars(options)).rejects.toThrow(NotFoundError);
    expect(mockPool.query).toHaveBeenCalledTimes(1); // hanya main query, skip enrich
  });
});
