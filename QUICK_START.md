# 🚀 Quick Reference Card

## One-Command Setup

```bash
# 1. Navigate to project
cd c:\Users\K1309\Downloads\Paws-Paychecks\Paws-Paychecks

# 2. Create .env.local
echo NODE_ENV=development > .env.local
echo PORT=5000 >> .env.local
echo DATABASE_URL=postgresql://localhost:5432/paws_paychecks_dev >> .env.local

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open browser
# Go to: http://localhost:5000
```

---

## Essential Commands

| Command | What It Does | When to Use |
|---------|-------------|-----------|
| `npm run dev` | Start dev server with hot reload | During development |
| `npm install` | Download dependencies | First time setup |
| `npm run build` | Create production build | Before deploying |
| `npm start` | Run production build | After `npm run build` |
| `npm run check` | Check TypeScript errors | Before committing |
| `npm run db:push` | Sync DB schema (optional) | If using PostgreSQL |

---

## Critical Files

| File | Purpose | What to Change |
|------|---------|-----------------|
| `.env.local` | Environment config | Port, database URL |
| `vite.config.ts` | Frontend build config | Already fixed ✅ |
| `server/index.ts` | Express server | Usually not needed |
| `package.json` | Dependencies | `npm install` handles |

---

## Environment Variables

```env
NODE_ENV=development         # Required: dev or production
PORT=5000                    # Required: server port
DATABASE_URL=postgresql://   # Required: dummy value OK for local
```

---

## What's Already Fixed ✅

- ✅ No Replit-specific APIs used
- ✅ No database required (in-memory storage works)
- ✅ All assets are relative paths
- ✅ Vite config handles local environment
- ✅ No special authentication needed
- ✅ Hot reload enabled for development

---

## Expected Outputs

**When you run `npm run dev`:**
```
[timestamp] [express] serving on port 5000
```

**In browser at http://localhost:5000:**
- Home screen with start button
- Player name input
- Job quiz
- Pet dashboard
- Minigames
- Shop
- Game history

---

## If Something Goes Wrong

1. **Stop server:** `Ctrl+C`
2. **Check .env.local:** Exists and has 3 lines
3. **Reinstall:** Delete `node_modules`, run `npm install`
4. **Clear cache:** Delete `.vite` folder
5. **Restart:** `npm run dev`
6. **Hard refresh:** `Ctrl+Shift+R` in browser

---

## Node.js Check

```bash
node --version
# Should output v18.0.0 or higher
```

If not installed: https://nodejs.org/ (LTS version)

---

## Port Already in Use?

Change in `.env.local`:
```env
PORT=3000
```

Then visit `http://localhost:3000`

---

## Zero Changes Needed ✅

This project requires **ZERO code modifications** to run locally. Only:
1. Create `.env.local`
2. Run `npm install`
3. Run `npm run dev`

That's it! 🎮
