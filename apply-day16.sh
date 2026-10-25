#!/usr/bin/env bash
# Jalankan dari folder ekstraksi patch. Target harus repository pribadimu.
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo 'Usage: bash apply-day16.sh "/path/to/bootcamp-product-app"' >&2
  exit 2
fi
SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$1"
if [[ ! -d "$TARGET/.git" || ! -d "$TARGET/project-AI" || ! -d "$TARGET/api-product" ]]; then
  echo 'Target harus root Git repo yang berisi project-AI/ dan api-product/.' >&2
  exit 1
fi
branch="$(git -C "$TARGET" branch --show-current)"
if [[ "$branch" != 'feature/day-16' ]]; then
  echo "Refusing to overwrite on branch '$branch'. Switch to feature/day-16 first." >&2
  exit 1
fi
if [[ -n "$(git -C "$TARGET" status --porcelain)" ]]; then
  echo 'Refusing to overwrite: repository has uncommitted changes. Commit/stash/review first.' >&2
  exit 1
fi
files=(
  'README.md'
  'project-AI/product-1.html'
  'project-AI/index.html'
  'project-AI/product-interaction.js'
  'project-AI/script.js'
  'project-AI/product-day15.css'
  'docs/DAY16_CONTROL_FLOW.md'
  'docs/TESTING_DAY16.md'
  'tests/day16-control-flow.test.cjs'
  'exercises/day16/README.md'
  'exercises/day16/latihan1_gratis_ongkir.js'
  'exercises/day16/latihan2_diskon_bertingkat.js'
  'exercises/day16/latihan3_kopi_gratis.js'
  'exercises/day16/latihan4_promo_mingguan.js'
  'exercises/day16/bonus.js'
)
for relative in "${files[@]}"; do
  [[ -f "$SOURCE/$relative" ]] || { echo "Missing $relative" >&2; exit 1; }
  mkdir -p "$(dirname "$TARGET/$relative")"
  cp "$SOURCE/$relative" "$TARGET/$relative"
  echo "Applied $relative"
done
printf '\nNext: cd to target; node --test tests/day16-control-flow.test.cjs; git diff.\n'
