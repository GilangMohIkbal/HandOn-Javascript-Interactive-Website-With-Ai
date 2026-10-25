// PPT Day 16 — Latihan 4: for + switch
for (let day = 1; day <= 7; day += 1) {
  let message;
  switch (day) {
    case 1:
      message = 'Senin: diskon sayur 10%';
      break;
    case 3:
      message = 'Rabu: beli 2 buah gratis 1';
      break;
    case 5:
      message = 'Jumat: gratis ongkir';
      break;
    case 6:
    case 7:
      message = 'Weekend: poin dobel';
      break;
    default:
      message = 'Harga normal';
      break;
  }
  console.log('Hari ' + day + ' -> ' + message);
}
