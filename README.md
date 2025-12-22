![Dericer Logo](./logo.png)

# Dericer Web

Dericer Web is the browser-based user interface for the **[dericer-core](https://github.com/mrfatolahi1/dericer-core)** personal finance core.  
It is a **local-first**, single-user, multi-currency expense tracking app that stores all data in the browser using **IndexedDB** and allows full backup/export to JSON in future versions.

## Tech Stack

- **React** + **TypeScript**
- **Vite** (bundler/dev server)
- **Tailwind CSS** (styling)
- **Custom layout components** (no heavy UI framework yet)
- **@tanstack/react-query** (data fetching/cache layer)
- **React Router** (routing)
- **IndexedDB** via a custom `StoragePort` adapter
- **dericer-core** (domain logic & accounting rules)

## Features (Current & Planned)

### Core behavior (via `dericer-core`)

- Multiple accounts with fixed currencies
- Multi-currency support (separate balances per currency)
- Transaction types: income, expense, debt, receivable, transfer
- Categories (hierarchical), tags, counterparty (simple name)
- Budgets per category and time range
- Simple goals
- Powerful querying/filtering on transactions (by date, type, category, tag, counterparty, amount, notes)
- Soft-delete semantics for transactions (mark-as-deleted)
- CSV/JSON export at the core layer

### Web UI (this project)

- Dashboard with high-level summary (accounts, currencies, monthly overview)
- Transactions page:
    - List of transactions
    - Basic filters and sorting
    - Form to create transactions
- Settings page:
    - (Planned) Backup & restore (export all data to JSON/ZIP, import back)
- Light / dark theme toggle
- Local-first behavior (no server, all data stays in your browser)

> **Important:** This is a personal/offline app. There is **no remote backend**.  
> Data lives in your browser (IndexedDB). Clearing site data will remove it unless you export a backup.

## Project Structure

Rough structure of the `src/` folder:

```text
src/
  app/
    App.tsx             # Main application component
    routes.tsx          # Route definitions
    providers/
      ThemeProvider.tsx # Light/dark theme handling
      QueryProvider.tsx # React Query setup
      CoreProvider.tsx  # Wiring dericer-core into React
  core/
    browser-core.ts     # Creates CoreApi with IndexedDB storage + TimePort
  storage/
    browser/
      indexeddb-storage.ts  # StoragePort implementation on top of IndexedDB
  components/
    layout/
      AppLayout.tsx     # Shell layout (sidebar + header + content)
      Sidebar.tsx       # Navigation
  pages/
    DashboardPage.tsx
    TransactionsPage.tsx
    SettingsPage.tsx
  styles/
    globals.css         # Tailwind base & global styles
  main.tsx              # React/Vite entry point
```

## Getting Started

### Prerequisites

- Node.js (LTS) + npm (or pnpm/yarn)
- An existing `dericer-core` package (installed from npm)

### Installation

```bash
# Install dependencies
npm install

# Make sure dericer-core is installed
npm install dericer-core
```

### Development

```bash
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

### Production Build

```bash
npm run build
npm run preview   # Optional: preview the production build
```

## Data Storage & Privacy

- All data is stored in **IndexedDB** under the current browser profile.
- There is **no** remote server and **no** automatic sync.
- You are responsible for your own backups (via export/import when implemented).
- If you clear browser storage or switch devices without exporting, you will lose local data.

## Relationship to `dericer-core`

- All domain logic and accounting rules live in `dericer-core`.
- This project is a thin UI layer around that core.
- Future desktop/mobile apps can reuse the same core package and data formats.

## License

Same license as the `dericer-core` project.
