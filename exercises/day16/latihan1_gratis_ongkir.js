// PPT Day 16 — Latihan 1: if / else
const subtotal = 120000;
let shipping = 0;

if (subtotal >= 100000) {
  console.log("Gratis ongkir!");
} else {
  shipping = 15000;
  console.log("Ongkir Rp" + shipping);
}

const totalPay = subtotal + shipping;
console.log("Total bayar: Rp" + totalPay);
