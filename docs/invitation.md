# Invitation

The guest invitation displays a lazy-loaded Google Maps iframe for Reichshof, Maximilianstraße 28, Bayreuth, before and after RSVP. After RSVP, the map appears below Apple Wallet. The iframe suppresses the referrer so the guest-specific invitation URL is not sent as the HTTP referrer. Loading the map still connects the guest's browser to Google; review applicable privacy and consent requirements before publication.

[Invitation UI scenarios](../tests/ui/invitation.spec.ts) use a local map response fixture; they check the iframe destination and layout, not Google's live map rendering.
