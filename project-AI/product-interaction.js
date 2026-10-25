// DAY 16 — Control Flow: satu file untuk Product 1 (hardcode) dan Product 2 (API).
// Satu listener submit menggantikan listener Day 15; tidak ada perhitungan ganda.
const day16Form = document.querySelector('#productForm');
const day16PriceElement = document.querySelector('#productPrice');
const day16VariantInput = document.querySelector('#variant');
const day16QuantityInput = document.querySelector('#quantity');
const day16Summary = document.querySelector('#selectionSummary');
const day16UnitList = document.querySelector('#unitList');
const day16Feedback = document.querySelector('#selectionFeedback');
const day16SubtotalText = document.querySelector('#subtotalText');
const day16CheckoutBar = document.querySelector('#checkoutBar');
const day16CheckoutButton = document.querySelector('#checkoutButton');

// Default menjalankan for. Gunakan ?loop=while untuk membandingkan hasil tanpa
// perlu mengubah kode; hanya SATU loop yang berjalan setiap kali submit.
const day16LoopMode = new URLSearchParams(window.location.search).get('loop') === 'while'
  ? 'while'
  : 'for';

// Pada kondisi gagal, jangan biarkan subtotal/unit dari submit sebelumnya tertinggal.
function day16ShowError(message) {
  day16Feedback.textContent = message;
  day16Summary.textContent = message;
  day16SubtotalText.textContent = '';
  day16UnitList.replaceChildren();
  day16CheckoutBar.hidden = true;
}

day16Form.addEventListener('submit', (event) => {
  event.preventDefault();
  day16Feedback.textContent = '';
  day16Summary.textContent = '';
  day16SubtotalText.textContent = '';
  day16UnitList.replaceChildren();
  day16CheckoutBar.hidden = true;

  // Sama seperti Day 15: input HTML menghasilkan string, lalu diubah ke number.
  const price = Number(day16PriceElement.dataset.price);
  const quantity = Number(day16QuantityInput.value);
  const variant = day16VariantInput.value;
  const isDemo = day16PriceElement.dataset.stockSource === 'demo';
  let availableStock;

  if (isDemo) {
    // Product 1: stok LATIHAN, bukan stok API (sesuai PG Day 16).
    switch (variant) {
      case 'S':
        availableStock = 5;
        break;
      case 'M':
        availableStock = 3;
        break;
      case 'L':
        availableStock = 0;
        break;
      default:
        day16ShowError('Varian tidak valid.');
        return;
    }
  } else {
    // Product 2: varian dinamis dari API; stok adalah stok TOTAL produk.
    // switch tetap memproses pilihan varian, tetapi tidak mengarang stok per ukuran.
    switch (variant) {
      case '':
        day16ShowError('Varian tidak valid.');
        return;
      default: {
        const isKnownVariant = Array.from(day16VariantInput.options).some(
          (option) => option.value === variant && option.value !== '' && !option.disabled
        );
        if (!isKnownVariant) {
          day16ShowError('Varian tidak valid.');
          return;
        }
        // Nilai ini diisi script.js dari product.variants.quantity pada API.
        const stockValue = day16PriceElement.dataset.stock;
        availableStock = stockValue === '' || stockValue === undefined ? NaN : Number(stockValue);
      }
    }
  }

  // if / else if / else: jalur pertama yang benar menang.
  if (!Number.isInteger(quantity) || quantity <= 0) {
    day16ShowError('Jumlah harus bilangan bulat positif.');
    return;
  } else if (!Number.isFinite(price) || price <= 0) {
    day16ShowError('Harga product belum tersedia.');
    return;
  } else if (!Number.isInteger(availableStock) || availableStock < 0) {
    day16ShowError('Data stok produk belum tersedia.');
    return;
  } else if (availableStock === 0) {
    day16ShowError('Varian sedang habis.');
    return;
  } else if (quantity > availableStock) {
    day16ShowError('Jumlah melebihi stok varian.');
    return;
  } else {
    const subtotal = price * quantity;
    day16Summary.textContent = 'Varian: ' + variant + ' · Jumlah: ' + quantity
      + ' · Subtotal Rp' + subtotal.toLocaleString('id-ID');
    day16SubtotalText.textContent = 'Rp' + subtotal.toLocaleString('id-ID');

    if (day16LoopMode === 'for') {
      // Versi A: for (AKTIF secara default).
      for (let unit = 1; unit <= quantity; unit += 1) {
        const item = document.createElement('li');
        item.textContent = 'Unit ' + unit + ' | Varian ' + variant;
        day16UnitList.appendChild(item);
      }
    } else {
      // Versi B: while (aktif hanya jika URL memakai ?loop=while).
      let unit = 1;
      while (unit <= quantity) {
        const item = document.createElement('li');
        item.textContent = 'Unit ' + unit + ' | Varian ' + variant;
        day16UnitList.appendChild(item);
        unit += 1; // wajib: tanpa update ini loop tidak pernah berhenti!
      }
    }
    day16CheckoutBar.hidden = false;
  }
});

// Tombol checkout tetap DEMO, tanpa transaksi backend.
day16CheckoutButton.addEventListener('click', () => {
  window.alert('Demo: halaman pembayaran belum tersedia.');
});
