# Paws & Paychecks - Local Development Migration Guide

## Executive Summary

Your Replit project uses **3 Replit-specific plugins** in the Vite config that must be removed for local development. The app currently uses **in-memory storage** (MemStorage), which is perfect for local development—no database setup needed! The only changes required are:

1. Remove/conditionally disable Replit Vite plugins
2. Create a `.env.local` file with basic settings
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server

---

## Part 1: Replit-Specific Code Found

### Replit Vite Plugins (Critical - Must Remove)

**File:** [vite.config.ts](vite.config.ts)

The following Replit plugins are conditionally loaded but will cause errors locally:

```typescript
// Lines 10-20 - These will fail without REPL_ID environment variable
...(process.env.NODE_ENV !== "production" &&
process.env.REPL_ID !== undefined
  ? [
      await import("@replit/vite-plugin-cartographer").then((m) =>
        m.cartographer(),
      ),
      await import("@replit/vite-plugin-dev-banner").then((m) =>
        m.devBanner(),
      ),
    ]
  : []),
```

**Plugins to Remove:**
- `@replit/vite-plugin-cartographer` - Provides Replit file structure visualization
- `@replit/vite-plugin-dev-banner` - Shows Replit dev environment banner  
- `@replit/vite-plugin-runtime-error-modal` - Replit error overlay (line 4)

**Solution:** Already handled! The code checks `process.env.REPL_ID` before loading. Since this won't exist locally, these plugins won't load. However, you can safely remove the import and simplify the plugins array.

---

## Part 2: Environment Variables Required

### Required Variables

**File:** [drizzle.config.ts](drizzle.config.ts) (line 3)

```typescript
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}
```

**Status:** ✅ **Safe to Skip for Local Development**

The app currently uses in-memory storage via `MemStorage` class ([server/storage.ts](server/storage.ts)). The `DATABASE_URL` is configured but NOT actively used. You have two options:

#### Option A: Use In-Memory Storage Only (Recommended for Local Dev)

**Create `.env.local`:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://localhost:5432/paws_paychecks
```

The database won't be queried—data persists in RAM during your session and resets on restart.

#### Option B: Set Up Local PostgreSQL (Optional)

If you want persistent data, install PostgreSQL and provide a real connection:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/paws_paychecks
```

Then run: `npm run db:push` to initialize schema.

---

## Part 3: Dependencies Status

### All Dependencies Are Locally Compatible ✅

**Checked and Safe:**
- React 18, TypeScript, Vite - Standard modern stack
- Express 5 - Works on any system
- TanStack Query - Pure JS library
- Radix UI / shadcn/ui - All web components
- Drizzle ORM - Works with PostgreSQL (optional)
- No Node.js native bindings required

**Already in package.json (don't need to install separately):**
- Tailwind CSS + PostCSS
- Type definitions (@types/*)
- All UI component libraries

### Dependency Installation

```bash
npm install
```

This will install all dependencies from `package.json` including:
- 60+ npm packages (all listed in dependencies)
- Development tools (TypeScript, Vite, etc.)
- UI frameworks (Radix UI, TailwindCSS)

**Time estimate:** 2-3 minutes on first install

---

## Part 4: UI & Asset Verification

### HTML & CSS Status ✅

**File:** [client/index.html](client/index.html)

✅ **All asset paths are relative and working:**
- Favicon: `<link rel="icon" type="image/png" href="/favicon.png" />`
- Google Fonts: CDN links (external, will work locally)
- Script src: `<script type="module" src="/src/main.tsx"></script>`

✅ **No Replit absolute paths** - Everything is relative or CDN

✅ **CSS:** Uses Tailwind (compiled at build time) and custom CSS in [client/src/index.css](client/src/index.css)

### Assets Required

The app expects a favicon at [client/public/favicon.png](client/public/favicon.png). If missing, the icon won't load but the app will still work.

---

## Part 5: Start Command

### Development Mode
```bash
npm run dev
```

**What this does:**
1. Runs `NODE_ENV=development tsx server/index.ts`
2. Starts Express server on port 5000 (or `$PORT` env var)
3. Integrates Vite HMR for hot module reloading
4. Watches client/server for changes
5. Output: `serving on port 5000`

**Access the app:** http://localhost:5000

### Production Build & Start
```bash
npm run build     # Bundles client (Vite) + server (esbuild)
npm start         # Runs NODE_ENV=production node dist/index.cjs
```

---

## Part 6: Step-by-Step Setup Plan

### Step 1: Create Environment File
```bash
# In the project root (c:\Users\K1309\Downloads\Paws-Paychecks\Paws-Paychecks\)
echo NODE_ENV=development > .env.local
echo PORT=5000 >> .env.local
echo DATABASE_URL=postgresql://localhost:5432/paws_paychecks >> .env.local
```

### Step 2: Install Dependencies
```bash
npm install
```

Expected output: `added X packages` (typically 300-400 packages)

### Step 3: Fix Replit Plugin Imports (Optional Cleanup)
**File:** [vite.config.ts](vite.config.ts)

You can optionally clean this up to remove the import for `runtimeErrorOverlay`:
- Current: `import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";` (line 4)
- Status: Imported but never used (no harm)
- Action: Can remove, but not required—it won't load since REPL_ID isn't set

### Step 4: Start Development Server
```bash
npm run dev
```

Expected output:
```
8:45:32 AM [express] serving on port 5000
```

Then visit: **http://localhost:5000**

### Step 5: Verify Game Loads
- Home screen with "Start Game" button ✅
- Enter player name ✅
- Take job aptitude quiz ✅
- Pet displays with cartoon animation ✅
- Dashboard with wallet/stats ✅

---

## Part 7: Known Limitations & Notes

### Data Persistence
- **Current:** In-memory storage resets when server restarts
- **Fix:** Set up PostgreSQL if you want data to survive restarts
- **Not urgent:** Fine for testing/development

### Environment Setup
- **Port:** Defaults to 5000 (override with `PORT=3000 npm run dev`)
- **NODE_ENV:** Must be "development" for HMR (hot reload)
- **DATABASE_URL:** Can be dummy value if not using PostgreSQL

### No Breaking Changes
- All imports in codebase are standard npm packages
- No Replit-specific APIs used (like @replit/database)
- No special authentication required
- No file system restrictions

---

## Part 8: Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm install` fails | Update Node.js to v18+ (`node --version`) |
| `DATABASE_URL` error | Set dummy URL in `.env.local` |
| Port 5000 already in use | Change PORT in `.env.local` or kill process |
| Vite plugin errors | Ensure `.env.local` doesn't set `REPL_ID` |
| Hot reload not working | Restart `npm run dev` |
| Build fails | Delete `dist/` folder and retry `npm run build` |

---

## Summary: What Changed?

✅ **Zero code changes needed** - Everything is already compatible!

✅ **One configuration file needed:** `.env.local`

✅ **No database required** - Use in-memory storage for local dev

✅ **Same start command:** `npm run dev`

✅ **Identical UI & behavior** - All assets load correctly locally

---

## Next Steps

1. Create `.env.local` file
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:5000
5. Play the game!

Good luck! 🎮
