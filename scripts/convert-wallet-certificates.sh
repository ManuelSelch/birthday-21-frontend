#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ] || [ "$#" -gt 3 ]; then
  echo "Usage: $0 <Apple WWDR .cer> [pass .cer] [output directory]" >&2
  exit 1
fi

wwdr_cert=$1
pass_cert=${2:-certificates/pass.cer}
output_dir=${3:-certificates}

if [ -e "$output_dir/pass.pem" ] || [ -e "$output_dir/wwdr.pem" ]; then
  echo "PEM output already exists; remove it before converting." >&2
  exit 1
fi

mkdir -p "$output_dir"
workdir=$(mktemp -d "$output_dir/.wallet-certificates.XXXXXXXX")
trap 'rm -rf "$workdir"' EXIT
openssl x509 -inform DER -in "$pass_cert" -out "$workdir/pass.pem"
openssl x509 -inform DER -in "$wwdr_cert" -out "$workdir/wwdr.pem"
# Hard links fail rather than overwrite if an output appears concurrently.
ln "$workdir/pass.pem" "$output_dir/pass.pem"
if ! ln "$workdir/wwdr.pem" "$output_dir/wwdr.pem"; then
  rm -f "$output_dir/pass.pem"
  exit 1
fi
echo "Created $output_dir/pass.pem and $output_dir/wwdr.pem"
