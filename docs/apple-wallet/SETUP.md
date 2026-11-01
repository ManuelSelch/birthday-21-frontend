# Apple Wallet signing setup

Run these commands from the project root. You need OpenSSL, curl, access to the Apple Developer account that owns the Pass Type ID, and the key passphrase. Here “key” means the signing private key, not an Apple account passkey.

## 1. Create a private key and CSR

If replacing existing credentials, back them up securely outside the repository first. **The commands below overwrite files with the same names.** Keep the old certificate and key until the replacement is tested. If the old passphrase is lost, a new key requires a new Apple-issued certificate; the old certificate cannot be used with it.

```bash
mkdir -p certificates
openssl genpkey -algorithm RSA -aes-256-cbc \
  -out certificates/my-key.key -pkeyopt rsa_keygen_bits:2048
openssl req -new -key certificates/my-key.key \
  -out certificates/pass.certSigningRequest
```

Choose a new key passphrase when prompted and store it securely. Enter your identifying information when creating the CSR. Never commit the key or passphrase.

## 2. Issue the pass certificate

1. Sign in to [Apple Developer](https://developer.apple.com/account/) and open **Certificates, Identifiers & Profiles**.
2. Create a **Pass Type ID Certificate** for the existing Pass Type ID in `passes/apple.pass/pass.json`. Upload `certificates/pass.certSigningRequest` when prompted.
3. Download the issued certificate and save it as `certificates/pass.cer`. This must be the certificate issued from the new CSR.
4. Check its issuer and validity:

   ```bash
   openssl x509 -inform DER -in certificates/pass.cer -noout -issuer -subject -dates
   ```

## 3. Download and convert certificates

The current download script retrieves Apple's WWDR **G4** intermediate. Check that the issuer above says `OU=G4`; if Apple issues the pass certificate under a different intermediate, obtain the matching certificate from [Apple's certificate authority page](https://www.apple.com/certificateauthority/) instead.

```bash
./scripts/download-wallet-certificate.sh
./scripts/convert-wallet-certificates.sh
```

The download replaces `certificates/AppleWWDRCAG4.cer` if present. Conversion chooses the intermediate by issuer/subject and creates `certificates/pass.pem` and `certificates/wwdr.pem`. It refuses to overwrite either PEM: after securely backing up the old files, remove the existing PEM files before converting. Remove duplicate matching intermediate `.cer` files if conversion reports multiple matches. The scripts do not create or alter the private key.

## 4. Configure and verify

Set `APPLE_WALLET_KEY_PASSPHRASE` in `.env` and in the deployment environment to the new key passphrase. Restart the app so it picks up the change. Keep the variable server-only and never commit `.env` or credentials.

Check the key and compare the two public-key fingerprints; they must match. OpenSSL prompts for the key passphrase:

```bash
openssl pkey -in certificates/my-key.key -noout -check
openssl pkey -in certificates/my-key.key -pubout -outform DER | openssl dgst -sha256
openssl x509 -in certificates/pass.pem -pubkey -noout | openssl pkey -pubin -outform DER | openssl dgst -sha256
```

Start the app and request `/api/apple-pass?id=<guest-id>` on the same host using a real guest ID. Open the downloaded `.pkpass` on an iPhone and verify that Wallet accepts it and displays the expected details. From a phone, `localhost` means the phone itself; use an address reachable from the phone.

If the key passphrase was exposed in Git history or elsewhere, moving it to `.env` does not remove the exposure. Consider replacing the key and certificate, and handle any history cleanup separately.
