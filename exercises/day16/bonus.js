// 1. Latihan kopi versi while.
let cup = 1;
let totalPay = 0;
while (cup <= 7) {
  if (cup % 5 !== 0) totalPay += 18000;
  cup += 1;
}
console.log("Kopi versi while: Rp" + totalPay); // 108000

// 2. Tabungan +50000 sampai target 300000.
let balance = 0;
let weeks = 0;
while (balance < 300000) {
  balance += 50000;
  weeks += 1;
}
console.log("Target tercapai pada minggu ke-" + weeks); // 6

// 3. Ternary untuk stok.
const stock = 0;
console.log(stock > 0 ? "Tersedia" : "Habis");

// 4. Countdown.
for (let count = 5; count >= 1; count -= 1) {
  console.log(count);
}
console.log("Mulai!");
