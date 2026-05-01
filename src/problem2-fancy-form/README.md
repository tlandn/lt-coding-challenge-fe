Hi, I implemented this currency swap form project. 

## Tech Stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Framework        | React 19                            |
| Build tool       | Vite 8                              |
| Language         | TypeScript 6                        |
| UI library       | Mantine 9                           |
| Styling          | Tailwind CSS 4                      |
| Icons            | Tabler Icons                        |
| Testing          | Vitest 4 + Testing Library          |
| Linting          | ESLint 10                           |

## Getting Started

### Prerequisites

- Node.js >= 20

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the URL shown in the terminal (default: `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview
```

## Testing

Tests are written with **Vitest** and **@testing-library/react**. Run them with:

```bash
npm test               # single run
npm run test:watch     # watch mode
```

### Test Coverage

- **SwapForm** — renders title, loading/error/live states, token inputs, swap direction toggle, rate display, and disabled confirm button.
- **TokenInput** — renders label, shows/hides USD value depending on price and amount.
- **formatRate** — adaptive decimal precision: 4 decimals for values ≥ 1, 6 decimals for ≥ 0.0001, 8 decimals for smaller values.

## Linting

```bash
npm run lint
```