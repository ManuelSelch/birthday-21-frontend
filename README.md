## 21st Birthday Invitation
- personalized digital invitation for our 2026 birthday party, based on the approved Midnight Gala design.
- Each guest receives a personalized QR code leading to a unique invitation page
- they can confirm attendance, view event info
- access a QR ticket and `Apple Wallet` link.

## Features
- Stadtball-inspired navy/gold design with readable mobile typography
- Wallet Integration
- Order System (planned) -- order drinks& snacks during the party
- Live Scoreboard (planned) -- track poker chips of each team

## Apple Wallet certificates
- For key creation, certificate issuance and verification, see [Apple Wallet setup](docs/apple-wallet/SETUP.md).
- Place the Apple-issued pass certificate at `certificates/pass.cer`. Run `./scripts/download-wallet-certificate.sh` to download Apple's WWDR G4 intermediate certificate. It replaces an existing `certificates/AppleWWDRCAG4.cer`; check the pass certificate issuer if it is not G4.
- Place the intermediate `.cer` in `certificates/` and run `bash scripts/convert-wallet-certificates.sh` from the project root. It selects the single certificate whose subject matches the pass certificate issuer, then creates `certificates/pass.pem` and `certificates/wwdr.pem`. Existing PEM files are not overwritten; remove them first if they should be replaced.
- Set `APPLE_WALLET_KEY_PASSPHRASE` in `.env` and in the production environment to the passphrase for `certificates/my-key.key`. Restart the app after changing it.
- Keep signing credentials and private keys out of Git. Conversion does not create or change the private key.

## Admin login
- Open `/admin/login` to manage guests, check-in, and points.
- Set `ADMIN_PASSWORD` in `.env` using [Admin setup](docs/admin-login/SETUP.md).
- Guest invitations do not require login.

## Tech Stack
- NextJS
- TailwindCSS & Mantine UI
