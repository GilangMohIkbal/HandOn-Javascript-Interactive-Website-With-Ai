// DAY 15: JavaScript Fundamentals — Product 1 hardcode & Product 2 API.
// Elemen dengan ID yang sama ada pada kedua halaman sehingga file ini bisa digunakan ulang.
const day15Form = document.querySelector('#productForm');
const day15PriceElement = document.querySelector('#productPrice');
const day15VariantInput = document.querySelector('#variant');
const day15QuantityInput = document.querySelector('#quantity');
const day15Summary = document.querySelector('#selectionSummary');
const day15SubtotalText = document.querySelector('#subtotalText');
const day15CheckoutBar = document.querySelector('#checkoutBar');
const day15CheckoutButton = document.querySelector('#checkoutButton');

// Event submit dijalankan saat tombol "Update pilihan" diklik.
day15Form.addEventListener('submit', (event) => {
  event.preventDefault(); // Jangan reload halaman.

  // Nilai dari atribut HTML dan input form awalnya string.
  const price = Number(day15PriceElement.dataset.price);
  const quantity = Number(day15QuantityInput.value);
  const variant = day15VariantInput.value;

  // Operator aritmatika (*) dan assignment (+=).
  let subtotal = 0;
  subtotal += price * quantity;

  // Comparison (!==, >) + logical (&&) menghasilkan boolean.
  // Number.isInteger menolak jumlah pecahan, Number.isFinite menjaga perhitungan.
  const hasSelection = variant !== '' && Number.isInteger(quantity) && quantity > 0
    && Number.isFinite(price) && price > 0;

  // String + number dan format mata uang (perhitungan tetap memakai number).
  day15Summary.textContent = 'Varian: ' + variant + ' · Jumlah: ' + quantity
    + ' · Harga: Rp' + price.toLocaleString('id-ID');
  day15SubtotalText.textContent = 'Rp' + subtotal.toLocaleString('id-ID');

  // Operator NOT (!) membalik boolean. Hanya muncul bila pilihan lengkap.
  day15CheckoutBar.hidden = !hasSelection;
});

// Day 15 masih demo: tombol tidak membuat transaksi/pembayaran sungguhan.
day15CheckoutButton.addEventListener('click', () => {
  window.alert('Demo: halaman pembayaran belum tersedia.');
});

// TODO(Day 16): tambah validasi stok, penanganan error, dan aturan percabangan.
