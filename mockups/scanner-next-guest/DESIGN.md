# Scan next guest — R1

- Status: R1 approved for implementation. User approval: “yes implement”.
- Scope: retain existing Midnight Gala scanner styling and add an explicit next-guest gate.
- After every scan result (success, already checked in, invalid ticket), scanner pauses until “Nächsten Gast scannen” is tapped. No automatic restart or timeout.
- Camera area shows a neutral paused placeholder. Result remains below it, followed by a full-width gold button and short explanatory line. Ready clears the previous result and restores scanning.
- Responsive: centered maximum 420px scanner/result/actions, full available width on mobile. Existing header preserved.
- Default state is success. Direct states: ?state=ready, loading, success, warning, error. Loading resolves to simulated success after 850ms.
- Preview-only controls simulate scans and outcomes. No camera, backend, permissions, persistence, or real guest data. Max Muster is fictional.
- Original approved scanner mockup remains unchanged at ../scanner/.
- Outstanding: none for this scope.
