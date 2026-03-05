# Paws & Paychecks Documentation

This file is the single source of truth for setup, architecture, gameplay rules, and troubleshooting.

## 1. Project Overview

Paws & Paychecks is a financial literacy game where the player:
- adopts a pet,
- takes a short job quiz,
- works through weekly minigames to earn money,
- pays weekly living costs,
- handles random life events,
- buys pet-care items,
- and earns a trophy after 12 in-game weeks.

## 2. Repository Layout

This repository is organized into multiple top-level folders. The runnable full-stack game app is in:

`Game_Logic/Paws-Paychecks`

Main directories you will use:

```text
Paws-and-Paycheecks/
+-- Documentation/                  # This README
+-- Data_Storage/                   # Environment + DB config copies
+-- User_Interface/                 # UI config copies
`-- Game_Logic/
    `-- Paws-Paychecks/             # Main application (client + server)
        +-- client/
        +-- server/
        +-- shared/
        +-- script/
        `-- package.json
```

## 3. Tech Stack

- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express 5 + TypeScript
- Styling/UI: Tailwind CSS + shadcn/ui + Radix UI
- Shared Types/Validation: Zod
- ORM configuration present: Drizzle (PostgreSQL dialect)
- Runtime storage currently used: in-memory server storage and browser localStorage

## 4. Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- npm

Note: Vite 7 enforces modern Node versions. Older Node versions will fail.

## 5. Quick Start (Local Development)

Run these commands from the repository root:

```bash
cd Game_Logic/Paws-Paychecks
npm install
npm run dev
```

Open:

`http://localhost:5000`

Important:
- You do **not** need a database to run the game locally.
- You do **not** need `.env.local` just to start development.

## 6. Environment Variables

### Required for `npm run dev`

None.

`NODE_ENV=development` is already set in the `dev` script.

### Optional

- `PORT` (default: `5000`)

macOS/Linux example:

```bash
PORT=3000 npm run dev
```

PowerShell example:

```powershell
$env:PORT=3000
npm run dev
```

### Required only for database tooling

- `DATABASE_URL` is required by `drizzle.config.ts` when running commands like `npm run db:push`.

Example value:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/paws_paychecks
```

## 7. Available Scripts

From `Game_Logic/Paws-Paychecks`:

- `npm run dev`  
  Starts Express + Vite middleware in development mode.

- `npm run build`  
  Builds client (`dist/public`) and bundles server (`dist/index.cjs`).

- `npm start`  
  Runs production server from `dist/index.cjs`.

- `npm run check`  
  Runs TypeScript type checking (`tsc`).

- `npm run db:push`  
  Pushes schema with Drizzle to PostgreSQL (requires `DATABASE_URL`).

## 8. Gameplay Rules (Code-Accurate)

### Game Length

- 12 weeks total.

### Quiz

- 5 aptitude questions.
- Assigns one job: `office`, `chef`, `engineer`, `teacher`, or `artist`.

### Base Salary by Job

- Office Worker: `$100`
- Chef: `$90`
- Engineer: `$120`
- Teacher: `$85`
- Artist: `$75`

### Starting Wallet

- Normal mode: `$100`
- Hard mode: `$50`

### Weekly Income Formula

`income = round(baseSalary * (0.5 + score/100))`

Hard mode applies an additional `0.75x` multiplier to weekly income.

### Weekly Expenses and Decay

- Living expenses each week:
  - Normal: `$50`
  - Hard: `$75`
- Pet stat decay each week:
  - Normal: `-5 health`, `-5 happiness`
  - Hard: `-8 health`, `-8 happiness`

### Events

Random weekly events can change:
- wallet balance,
- pet health,
- pet happiness.

Hard mode increases negative-event odds and reduces most positive-event odds.

### Shop

Shop purchases spend money and increase health and/or happiness.

### Trophies

Score weights:
- Income performance: 40%
- Average health: 30%
- Average happiness: 30%

Thresholds:
- Platinum (hard mode only): `>=95`
- Gold: `>=85`
- Silver: `>=70`
- Bronze: `>=50`
- None: `<50`

Additional trophy requirement:
- Final health `>=50`
- Final happiness `>=50`
- Final balance `>=0`

## 9. Game Flow and Screens

Phase/state flow:
- `home`
- `quiz`
- `dashboard`
- `minigame`
- `event`
- `shop`
- `endgame`
- `trophies`

The UI is rendered as a single-page app using phase-based conditional rendering.

## 10. Minigames

- 60 total minigames (`12 per job type`).
- Week-specific game selection comes from the minigame registry and current week.

Main registry file:
- `client/src/components/minigames/MinigameRegistry.tsx`

## 11. Data and Persistence

Current persistence behavior:

- Browser localStorage stores:
  - player name (`paws_paychecks_player_name`)
  - game history (`paws_paychecks_history`)

- Server currently uses in-memory storage in:
  - `server/storage.ts`

This means:
- browser history persists for the local browser profile,
- server-side memory resets when the server restarts,
- PostgreSQL is configured but not required for normal play.

## 12. API Endpoints (Server)

Available Express routes:

- `GET /api/player`  
  Returns current player name.

- `POST /api/player`  
  Body: `{ "name": "..." }`

- `GET /api/history`  
  Returns game history list.

- `POST /api/history`  
  Body must match `insertGameHistorySchema` in `shared/schema.ts`.

## 13. Key Files

- `Game_Logic/Paws-Paychecks/package.json`  
  Scripts and dependencies.

- `Game_Logic/Paws-Paychecks/server/index.ts`  
  Express server startup, middleware, and dev/prod behavior.

- `Game_Logic/Paws-Paychecks/server/routes.ts`  
  API endpoints.

- `Game_Logic/Paws-Paychecks/server/storage.ts`  
  In-memory storage implementation.

- `Game_Logic/Paws-Paychecks/client/src/App.tsx`  
  Main game state machine and screen flow.

- `Game_Logic/Paws-Paychecks/client/src/lib/gameLogic.ts`  
  Core rules (income, events, expenses, scoring).

- `Game_Logic/Paws-Paychecks/shared/schema.ts`  
  Shared data types, constants, and validation schemas.

## 14. Troubleshooting

### `npm run dev` fails because of Node version

Check:

```bash
node -v
```

Use Node 20.19+ (or 22.12+).

### Port already in use

Run on another port:

```bash
PORT=3000 npm run dev
```

### `DATABASE_URL, ensure the database is provisioned`

This appears when running Drizzle tooling without `DATABASE_URL`.

Fix:
- set `DATABASE_URL`,
- then re-run `npm run db:push`.

### Windows shows `'NODE_ENV' is not recognized`

Use Git Bash/WSL, or run with `cross-env`:

```bash
npx cross-env NODE_ENV=development tsx server/index.ts
```

### Replit plugin behavior locally

The project includes Replit Vite plugins. Two plugins only load when `REPL_ID` is set.  
If you manually set `REPL_ID` locally, remove it from your environment.

## 15. Production Build

From `Game_Logic/Paws-Paychecks`:

```bash
npm run build
npm start
```

Build output:
- client: `dist/public`
- server bundle: `dist/index.cjs`

## 16. Current Known Gaps

- Type-checking currently reports TS2802 errors in:
  - `client/src/components/minigames/chef/RecipeMinigame.tsx`
  - `client/src/components/minigames/office/PhoneMinigame.tsx`

These are existing issues in the current codebase and are not caused by documentation changes.
