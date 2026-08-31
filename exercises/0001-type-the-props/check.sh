#!/usr/bin/env bash
# Grades the three typing exercises using the work repo's own TypeScript (4.9.5),
# with the same `strict: false` setting ct-web-transport actually compiles under.
#
# An exercise passes only when BOTH hold:
#   - every "MUST compile" assertion type-checks, and
#   - every "MUST FAIL" assertion still fails (an unused @ts-expect-error is an error).
# So a type that is too loose fails just as loudly as one that is too tight.

set -uo pipefail
cd "$(dirname "$0")"

TSC="/Users/daniel.varghese/Desktop/ct-web-transport/ct-web-transport/node_modules/.bin/tsc"

if [[ ! -x "$TSC" ]]; then
  echo "✗ Can't find the repo's tsc at:"
  echo "  $TSC"
  echo "  Run 'npm install' in ct-web-transport, or point TSC at another tsc."
  exit 1
fi

pass=0
fail=0

for f in 01-*.ts 02-*.ts 03-*.ts; do
  printf '\n── %s\n' "$f"
  if out=$("$TSC" --noEmit --strict false "$f" 2>&1); then
    echo "   ✓ PASS"
    pass=$((pass + 1))
  else
    echo "$out" | sed 's/^/   /'
    echo "   ✗ FAIL"
    fail=$((fail + 1))
  fi
done

printf '\n═══════════════════════\n%d passed, %d failed\n' "$pass" "$fail"

if [[ $fail -eq 0 ]]; then
  echo "All three. Now write the repo-specific note — see the lesson."
else
  echo
  echo "Reading the errors:"
  echo "  TS2578 'Unused @ts-expect-error'  → your type is too LOOSE."
  echo "                                      Something that should have been"
  echo "                                      rejected was accepted."
  echo "  any other error on a 'MUST compile' line"
  echo "                                    → your type is too TIGHT."
fi

exit $fail
