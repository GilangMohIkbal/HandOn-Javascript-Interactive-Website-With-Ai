const API_BASE_URL = "http://localhost:3000";
const PHOTO_FALLBACK_URL = './assets/sneaker-placeholder.svg';
const requestedId = new URLSearchParams(window.location.search).get("id") || "1";
const money = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const $ = (selector) => document.querySelector(selector);

const heroImage = $("#hero-image");
const thumbnailList = $("#thumbnail-list");
const zoomThumbnailList = $("#zoom-thumbnails");
const zoomTrigger = $("#zoom-trigger");
const zoomDialog = $("#image-zoom");
const zoomImage = $("#zoom-image");
const status = $("#api-status");
// Day 15: selector form Product 2; pakai nama unik agar tidak bentrok dengan product-interaction.js.
const apiPriceElement = $("#productPrice");
const apiVariantInput = $("#variant");
const apiSubmitButton = $("#updateSelectionButton");
const apiCheckoutBar = $("#checkoutBar");
let activeImageIndex = 0;
let productImages = [];
let currentProduct;

function fallbackOnError(image) {
  image.addEventListener('error', () => {
    if (image.getAttribute('src') !== PHOTO_FALLBACK_URL) image.src = PHOTO_FALLBACK_URL;
  });
}

fallbackOnError(heroImage);
fallbackOnError(zoomImage);

function setImage(index) {
  if (!productImages.length) return;
  activeImageIndex = index;
  const image = productImages[index];
  document.querySelectorAll(".thumbnail").forEach((item, itemIndex) => {
    item.classList.toggle("is-active", itemIndex === index);
    item.setAttribute("aria-pressed", String(itemIndex === index));
  });
  document.querySelectorAll(".zoom-thumbnail").forEach((item, itemIndex) => {
    item.classList.toggle("is-active", itemIndex === index);
    item.setAttribute("aria-pressed", String(itemIndex === index));
  });
  heroImage.src = image;
  heroImage.alt = "Foto " + currentProduct.name;
  zoomImage.src = image;
  zoomImage.alt = heroImage.alt;
  const position = String(index + 1).padStart(2, "0") + " / " + String(productImages.length).padStart(2, "0");
  $("#image-index").textContent = position;
  $("#zoom-position").textContent = position;
}

function createThumbnail(image, index, product, zoom) {
  const button = document.createElement("button");
  button.className = zoom ? "zoom-thumbnail" : "thumbnail";
  button.type = "button";
  button.setAttribute("aria-label", "Tampilkan gambar " + (index + 1));
  const imageElement = document.createElement("img");
  imageElement.src = image;
  fallbackOnError(imageElement);
  imageElement.alt = zoom ? "" : "Foto " + product.name;
  button.append(imageElement);
  button.addEventListener("click", () => setImage(index));
  return button;
}

function renderGallery(product) {
  // Daftar URL berasal dari database melalui response API (maksimum 3 foto).
  productImages = Array.isArray(product.images) && product.images.length
    ? product.images.filter((url) => typeof url === 'string' && url.trim()).slice(0, 3)
    : [product.image];
  thumbnailList.replaceChildren();
  zoomThumbnailList.replaceChildren();
  productImages.forEach((image, index) => {
    thumbnailList.append(createThumbnail(image, index, product, false));
    zoomThumbnailList.append(createThumbnail(image, index, product, true));
  });
  zoomTrigger.disabled = false;
  setImage(0);
}

function showError(message) {
  // Mencegah subtotal dihitung dari data API yang gagal dimuat.
  apiPriceElement.dataset.price = "";
  apiPriceElement.dataset.stock = "";
  $("#selectionFeedback").textContent = "";
  $("#unitList").replaceChildren();
  apiVariantInput.disabled = true;
  apiSubmitButton.disabled = true;
  apiCheckoutBar.hidden = true;
  status.textContent = message;
  status.classList.add("is-error");
  $("#product-title").textContent = "Produk tidak dapat dimuat";
  $("#product-intro").textContent = "Pastikan API berjalan di localhost:3000, lalu muat ulang halaman.";
}

function renderProduct(product) {
  currentProduct = product;
  document.title = product.name + " | Escentric Molecules";
  $('meta[name="description"]').content = product.description.slice(0, 155);
  $("#breadcrumb-product").textContent = product.name;
  $("#product-title").textContent = product.name;
  apiPriceElement.firstChild.textContent = money.format(product.price) + " ";
  // Harga untuk operasi matematika harus dari API, bukan teks Rp yang diformat.
  apiPriceElement.dataset.price = String(product.price);
  // variants.quantity merepresentasikan stok TOTAL (bukan per varian).
  const totalStock = Number(product.variants?.quantity);
  if (!Number.isInteger(totalStock) || totalStock < 0) {
    showError("Stok produk dari API tidak valid.");
    return;
  }
  apiPriceElement.dataset.stock = String(totalStock);

  // Varian diisi dari data API. Jangan hardcode pilihan Product 2.
  apiVariantInput.innerHTML = '<option value="">Pilih varian</option>';
  product.variants.colorOrSize.forEach((value) => {
    apiVariantInput.add(new Option(value, value));
  });
  apiVariantInput.disabled = false;
  apiSubmitButton.disabled = false;
  apiCheckoutBar.hidden = true;
  $("#selectionFeedback").textContent = "";
  $("#unitList").replaceChildren();
  $("#product-intro").textContent = product.description;
  $("#product-description").textContent = product.description;
  $("#product-variants").textContent = product.variants.colorOrSize.join(" · ");
  const accords = $("#accords");
  accords.replaceChildren(...product.variants.colorOrSize.map((variant) => {
    const tag = document.createElement("span");
    tag.textContent = variant;
    return tag;
  }));

  // TODO(Day 16): aktifkan kembali validasi stok dan quantity control dari kode awal.
  // maxQuantity = product.variants.quantity;
  // updateQuantity(1);
  // addToBag.disabled = maxQuantity < 1;
  $("#stock-summary").textContent = "· Stok total: " + totalStock + " (API)";
  renderGallery(product);
  status.textContent = "";
  status.classList.remove("is-error");
}

async function loadProduct() {
  if (!/^\d+$/.test(requestedId) || Number(requestedId) < 1) {
    showError("ID produk tidak valid.");
    return;
  }
  try {
    const response = await fetch(API_BASE_URL + "/api/products/" + encodeURIComponent(requestedId), {
      headers: { Accept: "application/json" },
    });
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("json") ? await response.json() : null;
    if (!response.ok || !payload || !payload.data) {
      if (response.status === 404) throw new Error("Produk tidak ditemukan.");
      throw new Error("Detail produk belum dapat dimuat.");
    }
    renderProduct(payload.data);
  } catch (error) {
    showError(error.message === "Produk tidak ditemukan." ? error.message : "Tidak dapat menghubungi API produk. Coba lagi setelah server siap.");
  }
}

zoomTrigger.addEventListener("click", () => {
  setImage(activeImageIndex);
  zoomDialog.showModal();
});
$("#zoom-close").addEventListener("click", () => zoomDialog.close());
$("#zoom-previous").addEventListener("click", () => setImage((activeImageIndex + productImages.length - 1) % productImages.length));
$("#zoom-next").addEventListener("click", () => setImage((activeImageIndex + 1) % productImages.length));
zoomDialog.addEventListener("click", (event) => { if (event.target === zoomDialog) zoomDialog.close(); });
zoomDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") setImage((activeImageIndex + productImages.length - 1) % productImages.length);
  if (event.key === "ArrowRight") setImage((activeImageIndex + 1) % productImages.length);
});
$("#wishlist-button").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const isSaved = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", String(isSaved));
  $("#wishlist-label").textContent = isSaved ? "Ditambahkan ke wishlist" : "Tambah ke wishlist";
  button.querySelector(".wishlist-icon").textContent = isSaved ? "♥" : "♡";
});
document.querySelectorAll(".product-details details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".product-details details").forEach((otherDetail) => {
      if (otherDetail !== detail) otherDetail.open = false;
    });
  });
});
// TODO(Day 16): aktifkan kembali event +/− dan Add to bag setelah materi stok/percabangan.
// quantityMinus.addEventListener("click", () => updateQuantity(quantity - 1));
// quantityPlus.addEventListener("click", () => updateQuantity(quantity + 1));
// addToBag.addEventListener("click", () => { ... });

loadProduct();
