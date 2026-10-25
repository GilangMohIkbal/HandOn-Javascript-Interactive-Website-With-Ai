// PPT Day 16 — Latihan 3: for + if (setiap cup kelima gratis)
const price = 18000;
const quantity = 7;
let totalPay = 0;

for (let cup = 1; cup <= quantity; cup += 1) {
  if (cup % 5 === 0) {
    console.log("Cup " + cup + ": GRATIS");
  } else {
    console.log("Cup " + cup + ": Rp" + price);
    totalPay += price;
  }
}
console.log("Total bayar: Rp" + totalPay);
