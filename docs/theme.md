# Website theme

The shared charcoal, warm-ivory and champagne palette is defined by the `--site-*` tokens in [`app/globals.css`](../app/globals.css). The root layout applies Mantine's dark scheme and the shared page background. Invitation, programme and admin feature styles consume the tokens while retaining their own layouts and semantic status colors. The browser theme color and installed admin app manifest use the same charcoal background.

The invitation hero uses the user-provided birthday-stage image showing the three hosts. The separate public share banner and Apple Wallet pass are unchanged. See the [shared theme scenarios](../tests/ui/shared-theme.spec.ts) and the [invitation scenarios](../tests/ui/invitation.spec.ts) for behavioral coverage.
