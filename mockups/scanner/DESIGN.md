# Scanner theme — R2

- Status: approved for implementation.
- Goal: match the approved Midnight Gala admin guest list: navy background, gold accents, serif title, shared brand/header, restrained borders and German labels.
- Existing scanner flow retained: scan invitation QR, show check-in outcome, return to guest list. Centered camera area (maximum 420px), responsive full width on mobile.
- States: ready (default), loading, success, warning, camera error. Select via preview controls or `?state=success`, `?state=warning`, `?state=error`, `?state=loading`.
- Camera and results are simulated; no permission request, backend, credentials, or real check-ins. Preview-only state controls are not production UI. Guest-list navigation opens the existing admin mockup.
- No added production actions or workflow changes proposed. Actual warning/error details should come from the existing check-in response.
- Header shows only Ticket-Scanner and Gästeliste; no welcome eyebrow or camera instruction text.
- Approval: user explicitly requested “implement” after reviewing R2.
