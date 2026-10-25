# Checklist Pengujian — Day 15 dan Bonus

Catatan: checklist ini disusun berdasarkan Practical Guidance, panduan tambahan, dan riwayat pengujian peserta. Centang untuk hasil yang telah diuji di komputer sendiri. Jangan menganggap hasil unit test sebagai bukti otomatis tampilan browser atau database.

## A. Output Exercise resmi (Day 15)

- [ ] Product 1 ukuran S, qty 2 → subtotal Rp300.000.
- [ ] Product 1 qty 3 → subtotal Rp450.000, tanpa reload halaman.
- [ ] Product 1 varian S → M → teks ringkasan ikut berubah.
- [ ] Product 1 qty 0 dan 1,5 → form menolak input.
- [ ] Product 2 qty 2 → subtotal = harga dari API × 2 (bukan harga hardcode).
- [ ] Foto, deskripsi, header, footer, dan desain lama tetap tampil di dua halaman.

## B. Bonus — stok backend

- [ ] Buat produk dengan stok 10 dan varian S/M/L → GET detail mengembalikan `variants.quantity: 10` (bukan 30).
- [ ] Edit stok menjadi 12 → GET detail menghasilkan 12.
- [ ] Stok 0 valid jika schema mengizinkan → GET detail menghasilkan 0.
- [ ] Data produk yang sudah tersimpan tetap ada setelah migration.

## C. Bonus — tiga gambar

- [ ] Admin Vite menyimpan 1–3 URL gambar valid.
- [ ] GET detail mengembalikan field `image` dan `images` yang sesuai.
- [ ] Thumbnail bisa mengganti gambar utama; fungsi perbesar dan navigasi bekerja.
- [ ] Setelah refresh, tiga foto tetap tersimpan.
- [ ] Foto rusak memunculkan fallback tanpa merusak halaman.

## D. Otomatisasi

| Perintah | Ekspektasi | Riwayat yang dilaporkan |
|---|---|---|
| `npm run test:unit` (backend) | Semua test lulus | 51/51 lulus |
| `npm run test:integration` (backend) | Semua test lulus, database khusus testing | Dilaporkan berhasil setelah perbaikan konfigurasi |
| `npm test` (admin Vite) | Semua test lulus | Dilaporkan berhasil |
| `npm run build` (admin Vite) | Build berhasil | Dilaporkan berhasil |

> Data hasil di kolom terakhir berasal dari laporan peserta dalam percakapan; file log atau screenshot tidak otomatis tersimpan di repo. Jika perlu bukti, tambahkan screenshot terminal sendiri yang telah dibersihkan dari rahasia.

## E. Pemeriksaan submission

- [ ] `git status` bersih setelah commit.
- [ ] `.env`, file log, node_modules dan database backup tidak terlacak.
- [ ] Git remote mengarah ke repo pribadi, bukan repo mentor.
- [ ] Tag `day-15-submission` tersedia di GitHub.
- [ ] README dapat diikuti untuk menjalankan aplikasi dari clone baru.
