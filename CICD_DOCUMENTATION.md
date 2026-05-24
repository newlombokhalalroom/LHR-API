# Panduan Dokumen CI/CD - LHR API (Lombok Halal Room)

Dokumen ini berisi penjelasan lengkap mengenai alur kerja **CI/CD (Continuous Integration / Continuous Deployment)** pada proyek **LHR API** menggunakan **GitHub Actions**. Dokumentasi ini dirancang agar dapat memahami kebutuhan sistem, konfigurasi yang diperlukan, dan cara kerja workflow ini secara mandiri.

---

## 📌 Gambaran Umum Alur CI/CD

Workflow CI/CD diatur melalui berkas konfigurasi GitHub Actions di [`.github/workflows/ci-cd.yaml`](file:///d:/RFF/Kuliah/TUGAS%20AKHIR/LHR/LHR-API/.github/workflows/ci-cd.yaml). 

Pipeline ini terbagi menjadi 3 tahap utama (*Jobs*):
1. **Lint & Test**: Verifikasi kualitas kode, standardisasi penulisan (linter), serta menjalankan pengujian unit (*unit testing*). Tahap ini berjalan pada setiap **Push** dan **Pull Request** ke cabang (`branch`) `production`.
2. **Build & Push Docker Image**: Melakukan *build* berkas Docker Image API dan mengunggahnya (*push*) ke Docker Hub. Tahap ini **hanya** dijalankan ketika kode di-merge/push ke cabang `production`.
3. **Deploy to VPS**: Melakukan proses pembaruan aplikasi secara otomatis di server (VPS) menggunakan Docker Compose secara aman. Tahap ini **hanya** dijalankan setelah proses Build & Push berhasil.

```mermaid
graph TD
    A[Push / PR ke branch production] --> B[Job 1: Lint & Test]
    B -->|Sukses & Event = Push/Merge| C[Job 2: Build & Push Image]
    C -->|Sukses| D[Job 3: Deploy to VPS]
    
    subgraph Job 1: Lint & Test
        B1[Checkout Code] --> B2[Setup pnpm & Node 20]
        B2 --> B3[Install Dependencies]
        B3 --> B4[pnpm lint]
        B4 --> B5[pnpm vitest --coverage]
    end

    subgraph Job 2: Build & Push
        C1[Generate Short SHA Tag] --> C2[Login to Docker Hub]
        C2 --> C3[Build & Push Docker Image]
    end

    subgraph Job 3: Deploy to VPS
        D1[Copy docker-compose.yml via SCP] --> D2[SSH ke VPS]
        D2 --> D3[Update Tag di docker-compose.yml]
        D3 --> D4[docker compose pull & up]
        D4 --> D5[Health Check Port 3000]
        D5 --> D6[Prune Old Images]
    end
```

---

## 🛠️ Persyaratan & Persiapan (Prerequisites)

Sebelum workflow ini dapat dijalankan dengan sukses di GitHub, beberapa kredensial dan konfigurasi harus disiapkan terlebih dahulu di repositori GitHub Anda.

### 1. GitHub Secrets
Buka halaman repositori GitHub Anda, navigasikan ke **Settings** > **Secrets and variables** > **Actions**, lalu tambahkan beberapa **Repository secrets** berikut:

| Nama Secret | Kegunaan | Contoh Nilai |
| :--- | :--- | :--- |
| `DOCKERHUB_USERNAME` | Username akun Docker Hub organisasi/pribadi. | `lombokhalalroom` |
| `DOCKERHUB_TOKEN` | Access Token Docker Hub (sangat direkomendasikan dibanding password biasa). | `dckr_pat_...` |
| `VPS_HOST` | Alamat IP atau domain dari server VPS target. | `103.xxx.xx.xx` |
| `VPS_USER` | Username SSH untuk masuk ke server VPS. | `root` / `ubuntu` |
| `VPS_SSH_KEY` | Kunci Privat SSH (*SSH Private Key*) untuk login ke VPS tanpa password. | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `VPS_PORT` | Port SSH yang digunakan pada server VPS (biasanya 22). | `22` |

> [!WARNING]
> Pastikan `VPS_SSH_KEY` adalah *Private Key* pasangannya dari *Public Key* yang sudah dimasukkan ke file `~/.ssh/authorized_keys` di VPS Anda.

### 2. Struktur Direktori VPS
Di server VPS, pastikan folder tujuan deploy sudah dibuat dan memiliki izin akses yang tepat untuk user yang digunakan:
- Lokasi folder: `/opt/lhr-api`
- Command untuk mempersiapkannya di VPS:
  ```bash
  sudo mkdir -p /opt/lhr-api
  sudo chown -R $USER:$USER /opt/lhr-api
  ```

---

## ⚙️ Detail Konfigurasi Langkah (Workflow Steps)

Berikut penjelasan rinci dari setiap tahap pekerjaan (*Job*) yang ada di dalam pipeline:

### 1. Job: `lint-and-test`
*   **Trigger**: Berjalan pada `push` dan `pull_request` ke `production`.
*   **Langkah-langkah**:
    *   **Checkout**: Mengambil kode sumber terbaru dari repositori.
    *   **Setup pnpm & Node.js**: Menggunakan pnpm versi 9 dan Node.js versi 20. Proses ini memanfaatkan fitur *caching* pnpm untuk mempercepat instalasi dependency di kemudian hari.
    *   **pnpm install**: Melakukan instalasi dependency secara ketat sesuai lockfile (`--frozen-lockfile`).
    *   **pnpm lint**: Memastikan tidak ada pelanggaran aturan penulisan kode (*code style*) berdasarkan konfigurasi ESLint.
    *   **pnpm vitest run --coverage**: Menjalankan seluruh pengujian (*unit testing*) serta menghasilkan laporan cakupan tes (*code coverage*).

### 2. Job: `build-and-push`
*   **Trigger**: Hanya berjalan jika Job `lint-and-test` sukses dan event pemicunya adalah **Push** langsung (atau hasil merge dari PR) ke `production`.
*   **Langkah-langkah**:
    *   **Set Short SHA**: Membuat tag unik yang berasal dari 7 karakter pertama commit hash terbaru (misal: `a1b2c3d`). Ini berguna untuk menerapkan teknik *versioning* yang konsisten.
    *   **Docker Login**: Melakukan autentikasi keamanan ke Docker Hub.
    *   **Build & Push**: Membangun Docker Image berdasarkan [`Dockerfile`](file:///d:/RFF/Kuliah/TUGAS%20AKHIR/LHR/LHR-API/Dockerfile) dan mengunggahnya ke Docker Hub dengan dua tag sekaligus:
        *   `lombokhalalroom/lombok-halal-room-api:latest` (Selalu menunjuk ke versi paling baru)
        *   `lombokhalalroom/lombok-halal-room-api:<sha_short>` (Spesifik commit tertentu)

### 3. Job: `deploy-production`
*   **Trigger**: Hanya berjalan setelah Job `build-and-push` selesai dengan sukses.
*   **Langkah-langkah**:
    *   **Copy docker-compose**: Mengirimkan berkas [`docker-compose.yml`](file:///d:/RFF/Kuliah/TUGAS%20AKHIR/LHR/LHR-API/docker-compose.yml) terbaru dari repositori ke folder `/opt/lhr-api` di VPS menggunakan protokol SCP aman.
    *   **SSH Deploy & Atomic Update**:
        1. Masuk ke direktori `/opt/lhr-api`.
        2. Memperbarui isi berkas `docker-compose.yml` di VPS secara dinamis dengan mengganti tag image yang lama ke tag `<sha_short>` yang baru saja di-build.
        3. Menarik (*pull*) Docker Image terbaru dari Docker Hub.
        4. Menjalankan ulang kontainer (`docker compose up -d --remove-orphans`) agar server berganti ke versi baru.
        5. **Health Check**: Menjalankan *looping* pemanggilan `curl` ke port `3000` (port internal API) untuk memastikan aplikasi berhasil menyala dan mengembalikan status code `200` sebelum menganggap deployment berhasil.
        6. **Cleanup**: Menghapus sisa-sisa Docker Image lama yang sudah tidak terpakai menggunakan `docker image prune -f` guna menghemat ruang penyimpanan server VPS.

---

## 🚀 Cara Menjalankan CI/CD

Secara umum, developer **tidak perlu menjalankan pipeline ini secara manual**. Sistem berjalan secara otomatis melalui alur berikut:

1. **Membuat Fitur / Perbaikan**: Developer bekerja di branch fitur masing-masing (misal: `feature/tambah-login`).
2. **Membuat Pull Request (PR)**: Setelah selesai, ajukan PR dari branch fitur ke branch `production`.
3. **Tahap Pengujian Otomatis**: GitHub Actions akan otomatis memicu Job **Lint and Test**. Anda dapat melihat status centang hijau/silang merah di halaman PR. 
4. **Merge ke Production**: Setelah disetujui (*approved*) dan dipastikan lolos tes, lakukan merge PR ke cabang `production`.
5. **Deployment Otomatis**: Proses merge tersebut akan memicu GitHub Actions untuk melakukan **Build & Push Docker Image** kemudian langsung men-deploy-nya ke server VPS. Anda dapat memantau jalannya proses ini di tab **Actions** pada repositori GitHub.

---

## ❓ FAQ & Troubleshooting

#### 1. Bagaimana cara melihat log jika terjadi kegagalan deployment?
Anda dapat masuk ke tab **Actions** di repositori GitHub, klik workflow run yang gagal, kemudian klik pada langkah spesifik (misal: *SSH Deploy & Atomic Update*) untuk membaca log detail kegagalan. Jika error terjadi saat aplikasi dinyalakan di server, lakukan SSH ke VPS dan jalankan perintah:
```bash
cd /opt/lhr-api
docker compose logs --tail=100 -f
```

#### 2. Kapan image tag `latest` digunakan vs Short SHA?
Di server produksi, pipeline mengganti tag image secara dinamis ke **Short SHA** di `docker-compose.yml`. Hal ini memastikan bahwa pembaruan bersifat *atomic* dan mempermudah proses *rollback* ke versi sebelumnya jika ditemukan bug kritis di production.

#### 3. Bagaimana jika Health Check gagal (terus berjalan tanpa henti)?
Hal ini biasanya disebabkan karena aplikasi gagal *start* (crash) saat dijalankan di VPS karena masalah variabel lingkungan (`.env` yang belum diupdate di server) atau port `3000` bentrok dengan layanan lain.
*   Periksa isi file `.env` di VPS `/opt/lhr-api/.env`.
*   Periksa status kontainer dengan command `docker ps` atau `docker compose ps` di server VPS.
