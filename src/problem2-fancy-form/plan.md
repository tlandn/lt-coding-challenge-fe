\## Implementation Steps (as a human would think)

\### Step 1: Scaffold

```bash

npm create vite@latest . -- --template react-ts

npm install framer-motion lucide-react

npm install -D tailwindcss @tailwindcss/vite

Step 2: Configure Tailwind

\- Add @import "tailwindcss" to src/index.css

\- Set up content paths

Step 3: Define data models

\- src/types.ts — Token interface

\- src/constants.ts — 10 tokens with CoinGecko IDs + mock balances

Step 4: API layer

\- src/api/prices.ts — fetchTokenPrices(ids) → Record<string, number>

Step 5: Custom hooks

\- src/hooks/useTokenPrices.ts — fetch on mount, poll every 30s, return { prices, loading, error, refresh }

\- src/hooks/useSwapForm.ts — state machine for amounts, tokens, validation, submit

Step 6: Utility functions

\- src/utils/format.ts — formatBalance(), formatAmount(), formatRate()

Step 7: Build components (bottom-up)

1\. TokenIcon.tsx — colored circle with first letter

2\. CurrencySelector.tsx — dropdown with search, click-outside-to-close

3\. CurrencyInput.tsx — editable (From) + read-only (To) variants

4\. SwapDirectionButton.tsx — animated 180° rotate swap

5\. ExchangeRateInfo.tsx — skeleton / live / stale states

6\. SubmitButton.tsx — idle / loading / success / disabled states

7\. SwapCard.tsx — compose everything, wire hooks

Step 8: Wire in App.tsx

\- Full-screen centered layout with gradient background

Step 9: Run \& polish

\- npm run dev — test all flows manually

\- Tweak spacing, colors, animations, responsive breakpoints

\---

