#!/usr/bin/env bash
set -euo pipefail

mkdir -p certificates
temporary=$(mktemp certificates/.wwdr-download.XXXXXXXX)
trap 'rm -f "$temporary"' EXIT

curl --fail --location \
  --output "$temporary" \
  https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer

mv "$temporary" certificates/AppleWWDRCAG4.cer
echo "Downloaded certificates/AppleWWDRCAG4.cer"
