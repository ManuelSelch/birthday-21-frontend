# Mobile guest columns — R2

- Status: R2 approved for implementation. Approval: user clarified mobile-only indicators, then said “ah got it. perfect implement”. Approved source preserved.
- Goal: improve mobile readability without groups and hosts below guest names.
- Below 700px: Gast | Gruppen / Hosts | Status | Check-in. Groups in gold above hosts in muted text in one shared cell. Names 15px, assignments 14px, status/header 12px. Wrapping allowed; centered check-in retained.
- Mobile status uses a larger 14px circle without visible status text; status remains accessible via label and tooltip. Green = Zugesagt, red = Abgesagt, gray = Offen. Status column reduced to 44px; filter labels retained.
- Desktop keeps separate Gruppen and Hosts columns and labeled status badges.
- Existing navy/gold styling, local search/filter/create/edit interactions retained from the approved guest-groups mockup. Fake data only; no backend or real invitations.
- Assignment save confirmation and guest-count footer omitted as requested. Design-only footnote remains.
- Review at narrow mobile widths, especially long names and multiple hosts. Original approved guest-groups source preserved.
