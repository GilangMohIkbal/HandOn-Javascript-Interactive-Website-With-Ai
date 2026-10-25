# Day 16 — JavaScript Control Flow

Sumber utama: `Practical Guidance - JavaScript Control Flow.docx` dan slide Day 16 mentor.
Ini meneruskan project Day 15; tidak membuat database, API, atau halaman baru.

## Cakupan requirement

- `switch/case/break/default`: Product 1 memakai S=5, M=3, L=0; varian tidak dikenal ditolak.
- `if/else if/else`: quantity integer positif, harga finite positif, stok habis, stok tidak cukup, atau hasil valid.
- `for` dan `while`: keduanya membuat 1 `<li>` per unit; hanya satu loop dijalankan dalam satu submit.
- Product 2 tetap memakai **harga dan varian dari API**, sementara `variants.quantity` adalah **stok TOTAL produk**, bukan stok per ukuran. Jangan menerapkan nilai S/M/L latihan ke produk API.
- Bersihkan daftar unit dan subtotal lama sebelum melakukan perhitungan baru, termasuk saat submit gagal.

## Cara membandingkan loop

| Halaman | `for` (default) | `while` (alternatif) |
|---|---|---|
| Product 1 | `product-1.html` | `product-1.html?loop=while` |
| Product 2 | `index.html?id=2` | `index.html?id=2&loop=while` |

Pemilihan melalui query URL adalah kemudahan tambahan. Ketika submit, **hanya satu blok loop aktif**, bukan keduanya sekaligus. Output kedua versi harus identik.

## Mengapa stok Product 2 berbeda?

Pembaruan backend Day 15 menyimpan `products.stock` untuk seluruh produk, dan menyajikannya sebagai `variants.quantity` (bukan stok tiap warna/ukuran). Karena itu, untuk Product 2, `script.js` menulis `data-stock` dari API ke elemen `#productPrice`; `product-interaction.js` menggunakan nilai tersebut untuk semua varian yang dikenal. Tidak ada stok per-varian yang dikarang.

## Validasi browser vs JavaScript

`input#quantity` memakai `min="1" step="1" required`; browser bisa memblokir `submit` untuk angka 0, negatif, dan pecahan sebelum listener JavaScript dipanggil. Untuk **menguji jalur JavaScript**, gunakan sementara `document.querySelector('#productForm').noValidate = true` di Console, lalu ubah quantity dan klik Update Pilihan. Setelah pengujian kembalikan dengan `noValidate = false` atau refresh halaman. Ini sesuai catatan panduan resmi.

## Prinsip satu submit listener

File Day 15 `product-interaction.js` sudah diganti (bukan ditambahi listener kedua), sehingga subtotal tidak dihitung dua kali. Tombol pembayaran masih hanya demo; tidak ada pemrosesan order di database.

## Testing

Buka [TESTING_DAY16.md](TESTING_DAY16.md) untuk checklist manual, nilai ekspektasi, dan cara tes API.
