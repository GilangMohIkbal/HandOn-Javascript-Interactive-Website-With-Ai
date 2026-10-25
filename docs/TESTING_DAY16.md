# Catatan Pengujian — Day 16

Sumber: Practical Guidance JavaScript Control Flow, Langkah 7 dan Output Exercise.

> Status aktual masih harus dicatat setelah menjalankan build ini pada komputer sendiri. Jangan menandai semua skenario PASS sebelum melihat hasilnya.

| ID | Halaman | Skenario | Hasil yang diharapkan | Aktual | Status |
|---|---|---|---|---|---|
| P1-01 | Hardcode | S, qty 2 | Subtotal Rp300.000, 2 unit | Belum dicatat | Belum diuji lokal |
| P1-02 | Hardcode | M, qty 3 | Rp450.000, 3 unit | Belum dicatat | Belum diuji lokal |
| P1-03 | Hardcode | M, qty 4 | `Jumlah melebihi stok varian.`, daftar kosong | Belum dicatat | Belum diuji lokal |
| P1-04 | Hardcode | L, qty 1 | `Varian sedang habis.`, daftar kosong | Belum dicatat | Belum diuji lokal |
| P1-05 | Hardcode | Qty 0, -1, 1.5 | Browser menolak; saat `noValidate=true`, JS menampilkan `Jumlah harus bilangan bulat positif.` | Belum dicatat | Belum diuji lokal |
| P1-06 | Hardcode | Varian tidak dikenal | `Varian tidak valid.`, daftar kosong | Belum dicatat | Belum diuji lokal |
| P1-07 | Hardcode | Valid lalu input salah | Output lama hilang; daftar kosong | Belum dicatat | Belum diuji lokal |
| P1-08 | Hardcode | `?loop=while` vs `for` | Jumlah/isi unit sama, tanpa duplikasi | Belum dicatat | Belum diuji lokal |
| P2-01 | API | Product 2 qty 2 | Subtotal = **harga API** × 2; unit 2, jika stok mencukupi | Belum dicatat | Belum diuji lokal |
| P2-02 | API | Varian tidak dikenal | `Varian tidak valid.` | Belum dicatat | Belum diuji lokal |
| P2-03 | API | Stok produk 0 | `Varian sedang habis.` | Belum dicatat | Belum diuji lokal |
| P2-04 | API | Qty > stok API | `Jumlah melebihi stok varian.` | Belum dicatat | Belum diuji lokal |
| P2-05 | API | Backend mati | Form disabled; tidak menghitung memakai harga dummy | Belum dicatat | Belum diuji lokal |
| P2-06 | API | `&loop=while` vs `for` | Ringkasan unit sama | Belum dicatat | Belum diuji lokal |
| R-01 | Dua halaman | Galeri dan visual Day 15 | Gambar, deskripsi, header/footer, dan bonus galeri tetap tampil | Belum dicatat | Belum diuji lokal |

## Cara menguji cepat

1. Terminal backend: `cd api-product && npm run dev`. Database harus aktif jika menguji Product 2.
2. Jalankan halaman `project-AI` dengan Live Server.
3. Product 1: isi varian dan quantity, klik **Update Pilihan**, lalu uji kondisi-kondisi pada tabel.
4. Product 2: buka response `GET http://localhost:3000/api/products/2` dan cocokkan `price`, `variants.colorOrSize`, `variants.quantity` dengan halaman. Jangan menggunakan stok latihan S/M/L di sini.
5. Untuk mengganti versi loop: tambahkan `?loop=while` pada Product 1 atau `&loop=while` pada URL Product 2, kemudian refresh dan ulangi input sama.
6. Untuk menguji validasi JavaScript yang biasanya dicegah browser, sementara jalankan `document.querySelector('#productForm').noValidate = true` di Console. Kembalikan setelah selesai.
7. Setelah melakukan semua tes, isi Actual dan Status pada tabel dengan hasil nyata dan catat screenshot bila perlu.

**Pengujian otomatis yang disertakan** (`node --test tests/day16-control-flow.test.cjs`) menggunakan simulasi DOM/browser dan response API. Itu bukan pengganti tes manual pada Docker/PostgreSQL lokal.
