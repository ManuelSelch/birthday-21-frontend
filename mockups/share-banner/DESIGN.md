# WhatsApp invitation banner

- Revision R1 approved: user said “yes looks good”, then explicitly confirmed connecting the banner to the website. Static image source preserved; no preview server was started, so none required cleanup.
- 1200 × 630 JPEG, navy/gold, existing ballroom photograph, Georgia/Arial typography, shared hosts. No guest IDs or personal data.
- Render with `node mockups/share-banner/render.mjs` from the repository root; uses the existing installed Sharp dependency. System Georgia and Arial fonts are required for matching typography.
- Verified output dimensions and JPEG format; inspected the generated image directly. No browser automation needed for this static image.
- Source photograph: `../invitation-2026/assets/gala.jpg`, originally https://www.stadtballbayreuth.de/wp-content/uploads/2024/11/431191859_7427335603992299_3082343921711553263_n-1536x864.jpg . Source has embedded “SW Bayreuth / Screenshot” credit. See the invitation mockup DESIGN.md for provenance.
- Photo reuse/publication permission is not established. This draft reuses the existing website design reference, not a claim of image ownership or a confirmed venue. Before public deployment confirm rights and attribution requirements, or replace with an owned/licensed photo.
- Implemented: `/invite` uses static German Open Graph metadata with production metadataBase; the approved JPEG is served publicly through Next.js's `opengraph-image.jpg` convention with alt text and automatic dimensions. Shared preview contains no guest identity. No canonical/og:url override removes the personalised URL.
- Verification: unit tests check the metadata, exact approved image bytes and dimensions; the production HTTP test uses a WhatsApp user agent to check server-rendered head tags, the public image response and unchanged attendance. Deployment and real WhatsApp rendering/cache verification remain manual.
- After deployment, paste an invitation link in WhatsApp and wait for the preview before sending. WhatsApp controls presentation and caching; this does not hide the URL or its ID. Photo rights remain a publication prerequisite as above.
