export const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export function formatPrice(price) {
  return rupiah.format(price);
}

export function errorMessage(error) {
  if (error.status === 404 || error.problem?.type?.endsWith('/product-not-found')) {
    return 'Produk tidak ditemukan atau sudah dihapus.';
  }
  if (error.status === 400 && error.problem?.type?.endsWith('/invalid-product-id')) {
    return 'ID produk tidak valid.';
  }
  if (error.status === 400) return 'Data yang dikirim belum valid. Periksa kembali formulir.';
  if (error.status >= 500) return 'Server sedang mengalami gangguan. Silakan coba lagi nanti.';
  return error.message || 'Terjadi kesalahan jaringan. Silakan coba lagi.';
}

export function fieldErrors(problem) {
  return (problem?.errors || []).reduce((result, item) => {
    if (item.field && item.message) result[item.field] = item.message;
    return result;
  }, {});
}

export function validateProductInput(values) {
  const errors = {};
  const name = values.name.trim();
  const description = values.description.trim();
  const variants = values.variants.split(',').map((item) => item.trim()).filter(Boolean);
  const price = Number(values.price);
  const quantity = Number(values.quantity);

  if (!name || name.length > 120) errors.name = 'Nama wajib diisi dan maksimal 120 karakter.';
  if (!Number.isInteger(price) || price < 0) errors.price = 'Harga harus berupa bilangan bulat tidak negatif.';
  try {
    const url = new URL(values.image);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
  } catch { errors.image = 'URL gambar harus berupa URL HTTP atau HTTPS yang valid.'; }
  const images = Array.isArray(values.images) ? values.images.map((url) => url.trim()) : null;
  if (images) {
    if (images.length < 1 || images.length > 3) errors.images = 'Gunakan 1 sampai 3 foto.';
    if (new Set(images).size !== images.length) errors.images = 'URL foto tidak boleh sama.';
    if (images.some((item) => {
      try { const url = new URL(item); return !['http:', 'https:'].includes(url.protocol) || item.length > 2048; }
      catch { return true; }
    })) errors.images = 'Setiap foto harus URL HTTP/HTTPS yang valid (maksimal 2048 karakter).';
    if (images.length > 0 && images[0] !== values.image.trim()) errors.images = 'Foto pertama harus sama dengan gambar utama.';
  }
  if (!variants.length || variants.some((item) => item.length > 50)) errors['variants.colorOrSize'] = 'Masukkan minimal satu variasi, maksimal 50 karakter per variasi.';
  if (new Set(variants.map((item) => item.toLowerCase())).size !== variants.length) errors['variants.colorOrSize'] = 'Variasi tidak boleh duplikat.';
  if (!Number.isInteger(quantity) || quantity < 0) errors['variants.quantity'] = 'Jumlah stok harus berupa bilangan bulat tidak negatif.';
  if (!description || description.length > 2000) errors.description = 'Deskripsi wajib diisi dan maksimal 2.000 karakter.';

  return { errors, input: { name, price, image: values.image.trim(), ...(images ? { images } : {}), variants: { colorOrSize: variants, quantity }, description } };
}
