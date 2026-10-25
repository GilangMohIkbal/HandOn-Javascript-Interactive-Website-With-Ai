# Bootcamp Product App — Day 15 & Day 16

**Project:** Product Detail + Product API (kelanjutan project mentor)
**Peserta:** Gilang Moh. Ikbal
**Materi:** Day 15 JavaScript Fundamentals + Day 16 JavaScript Control Flow.

## Gambaran singkat

Project ini meneruskan codebase pembelajaran mentor: dua halaman detail produk dengan subtotal interaktif dan backend REST API produk.

- **Product 1** — `project-AI/product-1.html`: konten hardcode, harga Rp150.000 dan ukuran S/M/L.
- **Product 2** — `project-AI/index.html?id=2`: harga, varian, deskripsi, dan foto dari Express API.
- **Admin Vite** — `project-AI/frontend/`: membuat, mengedit, dan menghapus produk lewat API.
- **Bonus Day 15** — perbaikan perhitungan stok produk dan galeri maksimal tiga foto. Ini tambahan, bukan syarat utama Practical Guidance.

## Fitur Day 16 — Control Flow

- `switch` menentukan varian: Product 1 memakai data stok latihan S=5, M=3, L=0. Product 2 hanya memakai varian dan stok total yang diterima dari API.
- `if/else if/else` menghentikan subtotal bila quantity, harga, atau stok tidak valid.
- `for` (default) dan `while` (dengan `?loop=while`) menghasilkan daftar per unit pesanan; hanya satu loop aktif per submit.
- Output/error lama dibersihkan saat pilihan berubah; fitur Day 15 dan galeri foto tetap dipertahankan.
- Detail ketentuan dan testing: [Day 16 Control Flow](docs/DAY16_CONTROL_FLOW.md) dan [Testing Day 16](docs/TESTING_DAY16.md).

## Stack

HTML, CSS, JavaScript vanilla, Vite (admin), Node.js, Express, PostgreSQL 16, Docker Compose, Zod, Vitest, Supertest, OpenAPI/Swagger UI.

## Struktur

```text
.
├── api-product/             # Express API, migration, seed, tests
│   ├── src/
│   ├── migrations/          # 001–005 (termasuk stok dan gambar)
│   ├── scripts/
│   ├── tests/
│   ├── docker-compose.yml
│   └── .env.example
├── project-AI/              # Halaman produk vanilla JS
│   ├── index.html           # Product 2: data dari API
│   ├── product-1.html       # Product 1: data hardcode
│   ├── product-interaction.js
│   ├── script.js
│   ├── frontend/            # Admin Vite
│   └── assets/
└── docs/
    ├── TESTING_DAY15.md
    ├── TESTING_DAY16.md
    ├── DAY16_CONTROL_FLOW.md
    └── SUBMISSION_WORKFLOW.md
```

## Setup lokal

Prasyarat: Node.js versi yang kompatibel dengan Vite di `project-AI/frontend/package.json`, npm, Docker Desktop, dan Live Server (VS Code). Jika npm gagal menginstal Vitest, periksa versi npm dan Node.js.

### Backend (terminal 1)

```bash
cd api-product
npm ci
cp .env.example .env
# Sesuaikan kredensial DATABASE_URL dan DATABASE_TEST_URL pada .env lokal.
docker compose -f docker-compose.yml up -d
npm run migrate
npm run seed  # hanya pada database baru; jangan seed ulang data kerja yang ingin dipertahankan
npm run dev
```

Jika sudah pernah menyiapkan dan mengisi database, **jangan jalankan seed ulang**. Migration yang sudah diterapkan akan dilewati. Untuk stok lama, gunakan `node scripts/audit-stock.js` sebelum migration `004` ketika pindah dari database versi lama.

Endpoint:

- `http://localhost:3000/health`
- `http://localhost:3000/api/products/2`
- `http://localhost:3000/api-docs`

**Keamanan integration test:** `DATABASE_TEST_URL` harus benar-benar terpisah dari `DATABASE_URL` (database testing di port 5433). Test integrasi mereset tabel database testing.

### Halaman produk (Live Server)

Buka `project-AI/product-1.html` dan `project-AI/index.html?id=2` dengan VS Code Live Server. Product 2 memerlukan backend yang sedang berjalan. Contoh pada root Live Server `project-AI`: `http://127.0.0.1:5500/index.html?id=2`.

### Admin Vite (terminal 2)

```bash
cd project-AI/frontend
npm install
npm run dev
```

Alamat lokal umumnya `http://localhost:5173`. Pastikan `CORS_ORIGINS` backend mencakup alamat Live Server dan Vite.

## Testing

```bash
# Dari api-product/
npm run test:unit
npm run test:integration  # hanya setelah DB testing benar-benar terpisah

# Dari project-AI/frontend/
npm test
npm run build
```

Lihat [catatan pengujian Day 15](docs/TESTING_DAY15.md) untuk checklist manual utama dan bonus.

## Aturan implementasi

- Product 1 menggunakan data HTML; Product 2 **wajib** mengambil data asli dari API.
- Subtotal = harga dari sumber masing-masing × quantity yang dipilih, tanpa reload halaman.
- Input quantity harus bilangan bulat positif.
- Field respons lama `image` dan `variants.quantity` tetap dipertahankan; galeri tambahan memakai `images` (maksimal tiga URL).
- Stok total produk disimpan satu kali di `products.stock`, bukan hasil perkalian/penjumlahan stok salinan per varian.
- Tombol lanjut pembayaran hanyalah demo, bukan integrasi transaksi.

## Catatan penggunaan AI

AI digunakan sebagai rekan diskusi materi, peninjau (review), dan debugging, khususnya dalam membantu implementasi frontend serta perbaikan logika backend (fitur stok dan multiple image). AI juga membantu dalam menyusun skenario pengujian dan dokumentasi proyek. Seluruh hasil kode tetap diperiksa, diperbaiki, dan diuji kembali secara mandiri di lingkungan lokal

## Asal codebase

Project ini dilanjutkan dari materi mentor di [Dibimbing-Web-Bootcamp-Mentor / NEW_2026](https://github.com/daffabadrant9390/Dibimbing-Web-Bootcamp-Mentor/tree/master/NEW_2026); backend yang tersedia dalam materi juga merujuk repository `Fannan-Fauzan-Fardhurohman/api-product`. Atribusi dicantumkan untuk membedakan baseline pembelajaran dengan pekerjaan lanjutan.

## Submission Day 15 dan Day 16

- Versi Day 15 ditandai **tag `day-15-submission`** setelah semua tes lulus.
- Day 16 melanjutkan repository yang sama di branch `feature/day-16`; setelah diuji, merge ke `main` dan buat tag `day-16-submission`.
- Lihat [panduan Git dan pengumpulan](docs/SUBMISSION_WORKFLOW.md).

> Jangan commit `.env`, password asli, `node_modules`, backup database, atau hasil build. File `.env.example` hanya berisi nilai contoh.
