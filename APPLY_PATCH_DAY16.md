# Pemasangan Day 16 ke repository yang sudah ada

> **Gunakan patch ini untuk project lokal Day 15 yang sudah kamu uji.** Arsip full-project terpisah hanyalah rekonstruksi dari file Day 15 yang pernah tersedia di chat; bukan salinan langsung dari PC-mu.

## 1. Siapkan branch

Buka Git Bash pada root repository pribadimu (folder yang berisi `api-product/` dan `project-AI/`):

```bash
git status --short
git branch --show-current
git tag --list
```

Pastikan perubahan Day 15 sudah di-commit, dan tag `day-15-submission` sudah dibuat **pada commit Day 15** jika akan memakai tag sebagai pengumpulan. Jangan membuat tag Day 15 pada kode Day 16.

```bash
git switch main
git switch -c feature/day-16
```

Jika branch sudah ada, gunakan `git switch feature/day-16` (jangan membuat ulang).

## 2. Pasang file

Ekstrak `day16-control-flow-patch.zip` di lokasi lain, lalu salin isi folder `project-AI/`, `docs/`, `tests/`, `exercises/`, dan `README.md` ke root repository. Simpan backup jika memiliki perubahan sendiri pada file-file tersebut.

Alternatif untuk Git Bash: dari folder ekstraksi patch, dengan branch target sudah `feature/day-16` dan working tree bersih, jalankan:

```bash
bash apply-day16.sh "/d/Study 2026/Bootcamp batch 19/codebase/bootcamp-product-app"
```

**Sesuaikan alamat folder target dengan lokasi repository kamu.** Script ini hanya menyalin file Day 16 dan tidak mengubah `api-product/`, `.env`, database, `node_modules`, maupun folder `.git`.

## 3. Jalankan otomatis

Dari root repository:

```bash
node --test tests/day16-control-flow.test.cjs
node exercises/day16/latihan1_gratis_ongkir.js
node exercises/day16/latihan2_diskon_bertingkat.js
node exercises/day16/latihan3_kopi_gratis.js
node exercises/day16/latihan4_promo_mingguan.js
```

Untuk memastikan fitur lama tidak rusak, opsional jalankan kembali:

```bash
cd api-product
npm run test:unit
npm run test:integration   # hanya jika DATABASE_TEST_URL aman dan terpisah
cd ../project-AI/frontend
npm test
npm run build
```

Tidak perlu `npm install` tambahan khusus Day 16.

## 4. Uji manual di browser

- Jalankan API jika menguji Product 2 (`npm run dev` di `api-product/`).
- Buka `project-AI/product-1.html` melalui Live Server: S2, M3, M4, L1, varian tidak dikenal, input buruk.
- Buka `project-AI/index.html?id=2`: harga, varian, dan stok harus berasal dari API; galeri tiga foto masih berjalan.
- Bandingkan `product-1.html?loop=while` dan `index.html?id=2&loop=while` terhadap mode `for` default.
- Isi nilai aktual ke `docs/TESTING_DAY16.md`.

> Browser bawaan bisa menolak input 0, -1, dan 1.5 sebelum JavaScript dipanggil. Untuk melihat error dari JavaScript, set sementara `document.querySelector('#productForm').noValidate = true` di Console, dan pulihkan `false` setelah tes.

## 5. Commit dan push branch

```bash
git status --short
git add README.md project-AI/index.html project-AI/product-1.html project-AI/product-interaction.js project-AI/script.js project-AI/product-day15.css docs/DAY16_CONTROL_FLOW.md docs/TESTING_DAY16.md tests/day16-control-flow.test.cjs exercises/day16
git diff --cached --check
git diff --cached --stat
git commit -m "feat: implement day 16 control flow and stock validation"
git push -u origin feature/day-16
```

Setelah pengujian dan review selesai, integrasikan ke main:

```bash
git switch main
git merge --no-ff feature/day-16
git push origin main
git tag -a day-16-submission -m "Day 16 JavaScript Control Flow"
git push origin day-16-submission
```

Kirim tautan `https://github.com/USERNAME/REPO/tree/day-16-submission` ke mentor, ganti USERNAME/REPO dengan milikmu. **Tidak ada push otomatis dari paket ini.**

## 6. Sumber perubahan

- `Practical Guidance - JavaScript Control Flow.docx`: output utama dua halaman produk, switch + if/else, for + while, dan catatan testing.
- PPT JavaScript Control Flow Day 16: empat latihan coding tambahan dan bonus opsional (folder `exercises/day16/`).
