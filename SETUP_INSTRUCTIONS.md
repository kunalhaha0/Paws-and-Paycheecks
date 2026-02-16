# ✨ Paws & Paychecks - Local Setup Instructions

Complete these steps in order to run the game locally on your machine.

---

## 🎯 Quick Start (5 minutes)

### 1. Open Terminal in Project Root

Navigate to: `c:\Users\K1309\Downloads\Paws-Paychecks\Paws-Paychecks\`

```bash
cd c:\Users\K1309\Downloads\Paws-Paychecks\Paws-Paychecks
```

### 2. Create Environment File

Copy the template and create your local config:

```bash
copy .env.local.template .env.local
```

Or manually create `.env.local` with this content:

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://localhost:5432/paws_paychecks_dev
```

**What this does:**
- `NODE_ENV=development`: Enables hot reload and dev features
- `PORT=5000`: Server runs on http://localhost:5000
- `DATABASE_URL`: Not actively used (using in-memory storage), but required by drizzle config

### 3. Install Dependencies

```bash
npm install
```

**Expected output:**
```
up to date, audited 300+ packages in 2.5s
```

**⏱️ Time:** 2-3 minutes on first install, <5 seconds on subsequent runs

### 4. Start the Development Server

```bash
npm run dev
```

**Expected output:**
```
8:45:32 AM [express] serving on port 5000
```

### 5. Open the Game

Open your browser and go to:

```
http://localhost:5000
```

You should see the Paws & Paychecks home screen! 🎮

---

## 🔍 Detailed Explanation of Each Step

### Step 1: Navigate to Project Root

**Windows PowerShell:**
```powershell
cd "c:\Users\K1309\Downloads\Paws-Paychecks\Paws-Paychecks"
```

**Windows Command Prompt:**
```cmd
cd c:\Users\K1309\Downloads\Paws-Paychecks\Paws-Paychecks
```

**Verify:** Run `dir` or `ls` - you should see:
- `package.json`
- `vite.config.ts`
- `drizzle.config.ts`
- `client/` folder
- `server/` folder
- `shared/` folder

### Step 2: Create Environment File

**Option A: Using copy command (Recommended)**

```bash
copy .env.local.template .env.local
```

**Option B: Create manually**

1. Create new file named `.env.local` in the project root
2. Add these lines:
   ```
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://localhost:5432/paws_paychecks_dev
   ```
3. Save the file

**Verify:** Open `.env.local` and confirm it has the 3 lines above

### Step 3: Install Node Modules

```bash
npm install
```

This command:
- Reads `package.json` (your dependency list)
- Downloads 300+ npm packages to `node_modules/` folder
- Creates `package-lock.json` (locks versions)

**Requirements:** Node.js v18+ must be installed

**Check your version:**
```bash
node --version
```

Should output: `v18.0.0` or higher

**If Node is not installed:** Download from https://nodejs.org/ (LTS version)

### Step 4: Start Development Server

```bash
npm run dev
```

This runs the script from `package.json`:
```json
"dev": "NODE_ENV=development tsx server/index.ts"
```

It will:
1. Start Express server on port 5000
2. Enable Vite Hot Module Reload (HMR)
3. Watch for file changes
4. Recompile automatically on save

**Expected console output:**
```
8:45:32 AM [express] serving on port 5000
```

⚠️ **If you see errors:** Check the TROUBLESHOOTING section below

**To stop the server:** Press `Ctrl+C` in terminal

### Step 5: Access the Game

Open your browser (Chrome, Firefox, Safari, Edge):

```
http://localhost:5000
```

You should see:
- "Paws & Paychecks" title
- "Start Game" button
- Cartoon pet illustrations

---

## 🎮 Testing the Game

Once the home screen loads:

1. **Enter your name** and click "Start Game"
2. **Take the job quiz** (10 questions)
3. **Get assigned a job:** Office Worker, Chef, Engineer, Teacher, or Artist
4. **Play the dashboard:** See your pet, wallet, and stats
5. **Play minigames** to earn money
6. **Buy items** in the shop for your pet
7. **Handle random events** that affect your money/pet
8. **Complete 12 weeks** of gameplay
9. **View trophies** of past games

All features work the same as on Replit! ✅

---

## 🔧 Troubleshooting

### ❌ "npm: command not found"

**Problem:** Node.js/npm not installed

**Solution:**
1. Download Node.js: https://nodejs.org/
2. Install the LTS version
3. Restart your terminal
4. Verify: `node --version` (should show v18+)

---

### ❌ "DATABASE_URL, ensure the database is provisioned"

**Problem:** drizzle.config.ts requires DATABASE_URL

**Solution:** The `.env.local` file is missing or empty

1. Create `.env.local` with this content:
   ```
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://localhost:5432/paws_paychecks_dev
   ```
2. Save the file
3. Run `npm run dev` again

**Note:** The game doesn't actually use this database (uses in-memory storage), but the config file needs it to exist.

---

### ❌ "Port 5000 already in use"

**Problem:** Something else is using port 5000

**Solution 1: Change the port**

Edit `.env.local`:
```env
PORT=3000
```

Then run:
```bash
npm run dev
```

Visit: `http://localhost:3000`

**Solution 2: Kill the process using port 5000**

**Windows PowerShell:**
```powershell
netstat -ano | findstr :5000
# Note the PID number, then:
taskkill /PID <PID_NUMBER> /F
```

**Windows Command Prompt:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

---

### ❌ "npm install" fails

**Possible causes:**

1. **Old Node.js version**
   - Update to v18+: https://nodejs.org/
   
2. **Network issue**
   - Check internet connection
   - Try: `npm install --legacy-peer-deps`
   
3. **Corrupted node_modules**
   - Delete `node_modules` folder
   - Delete `package-lock.json` file
   - Run `npm install` again

---

### ❌ Hot reload not working (changes not showing)

**Solution:**
1. Stop the server: `Ctrl+C`
2. Delete `.vite` folder if it exists
3. Run: `npm run dev` again
4. Edit a file and save (should see instant reload)

---

### ❌ Game looks broken/missing CSS

**Problem:** Tailwind CSS not compiled

**Solution:**
1. Stop the server: `Ctrl+C`
2. Run: `npm install`
3. Run: `npm run dev`
4. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

### ❌ "Vite plugin error" or Replit-specific errors

**Problem:** Replit plugins are loading

**Solution:** Ensure `.env.local` does NOT contain:
```
REPL_ID=something
```

The app checks for `REPL_ID` to load Replit plugins. Locally, this should never be set.

---

## 📦 Available Commands

Once installed, you can run:

### Development (with hot reload)
```bash
npm run dev
```
- Starts server on port 5000
- Enables live reload
- Perfect for development

### Production Build
```bash
npm run build
```
- Builds client (Vite → dist/public/)
- Bundles server (esbuild → dist/index.cjs)
- Creates optimized production files
- Takes ~30 seconds

### Run Production Build
```bash
npm start
```
- Runs the built production server
- No hot reload
- Reads from `dist/` folder
- Must run `npm run build` first

### Type Checking
```bash
npm run check
```
- Validates TypeScript
- No compilation, just checks
- Useful for catching errors before build

### Database Schema Push (Optional)
```bash
npm run db:push
```
- Pushes Drizzle ORM schema to PostgreSQL
- Only needed if you set up a real database
- Safe to skip for local in-memory testing

---

## 📁 File Structure

```
Paws-Paychecks/
├── .env.local                 ← Your local environment config
├── package.json              ← Dependencies & scripts
├── vite.config.ts            ← Frontend build config
├── drizzle.config.ts         ← Database ORM config
├── tsconfig.json             ← TypeScript config
├── client/
│   ├── index.html            ← Entry HTML
│   ├── src/
│   │   ├── main.tsx          ← React entry
│   │   ├── App.tsx           ← Main component
│   │   ├── pages/            ← Screen components
│   │   ├── components/       ← UI components
│   │   └── lib/              ← Utilities
│   └── public/               ← Static assets (favicon, etc)
├── server/
│   ├── index.ts              ← Express server setup
│   ├── routes.ts             ← API endpoints
│   ├── storage.ts            ← In-memory data storage
│   └── vite.ts               ← Vite middleware setup
└── shared/
    └── schema.ts             ← Zod schemas & types
```

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] `.env.local` file exists in project root
- [ ] `npm install` completed without errors
- [ ] `npm run dev` outputs "serving on port 5000"
- [ ] Browser opens to `http://localhost:5000` without 404
- [ ] Game home screen is visible with buttons
- [ ] Game is playable (can start game, see pet, play minigames)
- [ ] Hot reload works (edit file, save, see change instantly)

If all ✅, you're ready to play! 🎮

---

## 🎓 Understanding the Architecture

### What happens when you run `npm run dev`?

1. **Server starts:**
   - Reads `.env.local` for PORT and NODE_ENV
   - Starts Express HTTP server
   - Listens on `http://localhost:5000`

2. **Vite development server:**
   - Watches client files for changes
   - Serves frontend with HMR (hot module reload)
   - No build step—instant feedback on save

3. **API endpoints:**
   - `/api/player` → Get/set player name
   - `/api/history` → Get/add game history
   - Other routes use in-memory MemStorage class

4. **Data storage:**
   - Currently: In-memory only (resets on restart)
   - Optional: Can swap for PostgreSQL by setting DATABASE_URL

### What's different from Replit?

| Feature | Replit | Local |
|---------|--------|-------|
| Server | Replit managed | Your machine |
| Port | Dynamic (Replit assigns) | Fixed (5000 or custom) |
| Storage | Persistent (cloud) | In-memory (session only) |
| Plugins | Replit-specific load | Disabled (check for REPL_ID) |
| Database | PostgreSQL via Replit | Not required (in-memory works) |
| Hot reload | Limited | Full HMR support |

---

## 📞 Need Help?

1. Check the Troubleshooting section above
2. Verify `.env.local` has correct values
3. Ensure Node.js v18+ is installed
4. Try: `npm install` → `npm run dev`
5. Clear browser cache: `Ctrl+Shift+Delete`

---

## 🚀 Next Steps

1. ✅ Complete Setup above
2. ✅ Play the game and test features
3. Optional: Set up PostgreSQL for persistent data
4. Optional: Deploy to production (run `npm run build` then `npm start`)

Enjoy the game! 🎮🐾💰
