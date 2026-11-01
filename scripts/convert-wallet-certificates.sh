#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 0 ]; then
  echo "Usage: $0" >&2
  exit 1
fi

pass_cert=certificates/pass.cer
output_dir=certificates

if [ -e "$output_dir/pass.pem" ] || [ -e "$output_dir/wwdr.pem" ]; then
  echo "PEM output already exists; remove it before converting." >&2
  exit 1
fi

mkdir -p "$output_dir"
workdir=$(mktemp -d "$output_dir/.wallet-certificates.XXXXXXXX")
trap 'rm -rf "$workdir"' EXIT
openssl x509 -inform DER -in "$pass_cert" -out "$workdir/pass.pem"
issuer=$(openssl x509 -in "$workdir/pass.pem" -noout -issuer -nameopt RFC2253 | cut -d= -f2-)
matches=0
for candidate in "$output_dir"/*.cer; do
  [ "$candidate" = "$pass_cert" ] && continue
  subject=$(openssl x509 -inform DER -in "$candidate" -noout -subject -nameopt RFC2253 2>/dev/null | cut -d= -f2-) || continue
  if [ "$subject" = "$issuer" ]; then
    matches=$((matches + 1))
    wwdr_cert=$candidate
  fi
done
if [ "$matches" -ne 1 ]; then
  echo "Expected one matching intermediate certificate in $output_dir; found $matches." >&2
  exit 1
fi
openssl x509 -inform DER -in "$wwdr_cert" -out "$workdir/wwdr.pem"
# Hard links fail rather than overwrite if an output appears concurrently.
ln "$workdir/pass.pem" "$output_dir/pass.pem"
if ! ln "$workdir/wwdr.pem" "$output_dir/wwdr.pem"; then
  rm -f "$output_dir/pass.pem"
  exit 1
fi
echo "Created $output_dir/pass.pem and $output_dir/wwdr.pem"
