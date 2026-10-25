// PPT Day 16 — Latihan 2: else if, batas tertinggi dahulu
const subtotal = 300000;
let discountPercent = 0;

if (subtotal >= 500000) {
  discountPercent = 15;
} else if (subtotal >= 200000) {
  discountPercent = 10;
} else {
  discountPercent = 0;
}

const discount = (subtotal * discountPercent) / 100;
const totalPay = subtotal - discount;
console.log("Diskon " + discountPercent + "%");
console.log("Total bayar: Rp" + totalPay);
