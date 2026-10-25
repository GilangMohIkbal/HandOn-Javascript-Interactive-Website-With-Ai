# Workflow GitHub Submission: Day 15 → Day 16

## Mengapa satu repository?

Day 16 melanjutkan Day 15. Gunakan `main` untuk versi terbaru, branch `feature/day-16` untuk pengerjaan, dan **tag** sebagai snapshot hasil submission yang tidak berubah.

## Amankan source code yang sudah diuji

Pada codebase awal terdapat `.git` di folder backend dan remote ke repository lain. Jangan langsung `git push` dari folder backend lama. Jalankan script `prepare-github.sh` dari Git Bash untuk membuat **salinan baru** yang bersih tanpa menghapus atau mengubah source asli.

1. Simpan `github-kit/` (paket ini) sejajar dengan folder `api-product/` dan `project-AI/`.
2. Buka Git Bash di folder induk yang memiliki kedua folder tersebut.
3. Jalankan:

```bash
bash github-kit/prepare-github.sh . ../bootcamp-product-app
cd ../bootcamp-product-app
```

Script mengecualikan `.git` lama, `.env`, `node_modules`, build output, cache dan backup. Ini **menyalin source code lokal yang sudah kamu uji**, bukan menggantinya dengan rekonstruksi source dari ZIP lama.

## Periksa sebelum commit

```bash
git init -b main
git status --short
git add .
git diff --cached --check
git diff --cached --name-only
```

Pastikan tidak ada `.env`, `.dump`, password sungguhan, file yang berisi token, atau folder `node_modules`. Gunakan `git status --ignored` untuk melihat file yang dikecualikan. Jika ragu, jangan commit sebelum memeriksa.

## Push Day 15

Buat repository GitHub **kosong** milik pribadi, tanpa README otomatis, tanpa .gitignore otomatis, tanpa license otomatis, misalnya `bootcamp-product-app`.

```bash
git commit -m "feat: complete day 15 product website and backend bonus"
git remote add origin https://github.com/USERNAME/bootcamp-product-app.git
git remote -v  # pastikan URL milik sendiri
git push -u origin main
git tag -a day-15-submission -m "Day 15 submission"
git push origin day-15-submission
```

Kirim URL tag berikut ke mentor: `https://github.com/USERNAME/bootcamp-product-app/tree/day-15-submission` (ganti USERNAME).

## Day 16

```bash
git switch -c feature/day-16
# implementasikan dan jalankan testing
# setelah perubahan siap:
git add .
git commit -m "feat: complete day 16 conditional and looping"
git switch main
git merge feature/day-16
git tag -a day-16-submission -m "Day 16 submission"
git push origin main
git push origin day-16-submission
```

Jika Git menolak merge, jangan force push; periksa konflik lebih dahulu.
