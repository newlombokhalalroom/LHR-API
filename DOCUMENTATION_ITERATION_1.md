# Dokumentasi Pengembangan Lengkap: Iterasi 1 (Tour Package Module)

## 1. Ringkasan Iterasi
Iterasi 1 berfokus pada fondasi utama modul **Tour Package** di platform Lombok Halal Room (LHR). Tujuan utamanya adalah memungkinkan Mitra (Tour Agent) untuk mendaftar, diverifikasi, dan mengelola paket wisata mereka (baik Open Trip maupun Private Trip) secara mandiri tanpa mengganggu modul produk lainnya (Hotel/Rental).

---

## 2. User Story 15: Pendaftaran & Verifikasi Mitra
Memungkinkan calon mitra untuk bergabung dan divalidasi oleh Super Admin.

### Alur Kerja:
1.  **Pendaftaran**: Calon mitra melakukan registrasi melalui halaman Signup.
2.  **Penyimpanan Data**: Akun dibuat di tabel `users` (scope: admin) dan data bisnis di tabel `clients` (approved_by: null).
3.  **Verifikasi**: Super Admin menyetujui mitra melalui Dashboard Super Admin.

### Perubahan Kode:
*   **Backend**: Penambahan metode `putClientApproval` di `ClientsService.js`.
*   **Frontend**: Halaman `pages/super-admin/clients/index.vue` untuk manajemen approval.

---

## 3. User Story 03: Mengelola Data Paket Wisata
Mitra dapat mengelola informasi detail paket wisata (Trip Details & Itineraries).

### Alur Kerja:
1.  Mitra mengisi form paket termasuk rincian hari per hari (itinerari).
2.  Sistem menyimpan data ke tabel `products`, `trip_details`, dan `itineraries`.

### Perubahan Kode:
*   **Database**: Migrasi baru untuk tabel `trip_details` dan `itineraries`.
*   **Backend**: `ProductsService.js` menggunakan transaksi database untuk sinkronisasi 3 tabel.
*   **Frontend**: Form dinamis di `pages/Admin/tour-agent/packages/submit/index.vue`.

---

## 4. User Story 04: Mengelola Jadwal & Kuota (Open Trip)
Manajemen tanggal keberangkatan dan ketersediaan kursi untuk paket Open Trip.

### Alur Kerja:
1.  Mitra menentukan tanggal keberangkatan dan total kuota.
2.  Sistem memvalidasi ketersediaan kursi saat proses pemesanan.

### Perubahan Kode:
*   **Database**: Tabel `tour_schedules`.
*   **Backend**: Logic update jadwal di `ProductsService.js` dengan metode *Delete-then-Insert* di dalam transaksi.

---

## 5. User Story 05: Mengatur Variasi Harga Hotel (Partner Hotel)
Opsi "Include Hotel" untuk Private Trip dengan daftar hotel rekanan mitra.

### Alur Kerja:
1.  Mitra mengelola daftar hotel rekanan dan harga per malam.
2.  Data digunakan untuk menghitung total harga paket secara dinamis.

### Perubahan Kode:
*   **Backend**: API Plugin baru `src/api/partnerHotels` dan `PartnerHotelsService.js`.
*   **Frontend**: Halaman manajemen hotel di `pages/Admin/tour-agent/hotel-partner/index.vue`.

---

## 6. User Story 01: Katalog Paket Wisata
Menampilkan paket tour yang sudah disetujui kepada publik.

### Alur Kerja:
1.  Wisatawan melihat katalog paket.
2.  Filter otomatis hanya menampilkan produk kategori tour.

---

## 7. Arsitektur Modular & Keamanan Modul Lain
Pengembangan ini dirancang agar **tidak merusak** modul Hotel atau Rental Mobil yang sudah ada.

*   **Optional Payload**: Parameter tour pada `addProduct` bersifat opsional. Jika produk adalah Hotel/Rental, parameter ini akan diabaikan.
*   **Conditional Guard Clauses**: Query ke tabel khusus tour hanya berjalan jika data tour terdeteksi (`if (trip_detail)`).
*   **Pemisahan Tabel**: Data tour tidak dicampur di tabel `products` utama, melainkan menggunakan tabel relasional terpisah.

---

## 8. Status Teknis
1.  **Integritas**: Menggunakan PostgreSQL Transactions.
2.  **Validasi**: Joi Validation diperbarui untuk mendukung field tour secara opsional.
3.  **UI/UX**: Konsistensi Dark Mode menggunakan Naive UI.
