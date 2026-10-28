# Compact mobile guest table
- Revision R2; status: approved. Original approved admin-ui mockup is unchanged.
- Three columns: Name, Status, Check-in. Remove separate invitation action column and per-guest “+1 Begleitung” labels. Companion data and summary counts remain unchanged.
- Guest names link to invitations: gold when invited is false, muted grey when true. No tooltip, eye/check icon or browser-history tracking.
- Check-in heading and values are centered together (user-requested implementation adjustment).
- Mobile cells use 12px vertical / 8px horizontal padding. Fixed table layout allows long names to wrap without widening the page. Links retain visible keyboard focus and a 44px minimum height.
- Fake invited values show both states. Name links display a notice rather than opening real invitations or changing invited. Other mock interactions remain local; no backend or persistence.
- Approval: user approved R2 with “looks good. implement”. Approved sources preserved; managed preview stopped and owned process/listener exit verified before production implementation.
