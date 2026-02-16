# Paws & Paychecks

## Overview

Paws & Paychecks is a virtual pet financial literacy game where players adopt a pet and manage both pet care and personal finances over 12 in-game weeks. Players take a job aptitude quiz to get assigned a career, play weekly job-specific minigames to earn income, purchase supplies for their pet, and navigate random financial events. The game teaches money management through engaging gameplay with dynamic pet visuals that reflect health and happiness stats.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for Replit integration
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **State Management**: React useState for game state, TanStack Query for server state
- **Routing**: Single-page application with phase-based screen rendering (no router library)

### Game Flow Design
The game uses a phase-based state machine:
1. `home` - Player name entry and game start
2. `quiz` - Job aptitude quiz to determine career
3. `dashboard` - Main game view showing pet stats, wallet, and actions
4. `minigame` - Job-specific interactive games (typing, sorting, puzzle, matching, color)
5. `event` - Random financial events that affect balance/stats
6. `shop` - Purchase items for pet care
7. `endgame` - Final results and trophy award
8. `trophies` - Historical game records

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ESM modules
- **API Style**: REST endpoints under `/api/*` prefix
- **Development Server**: Vite middleware for HMR in development
- **Production**: Static file serving from compiled `dist/public`

### Data Storage
- **Current**: In-memory storage (`MemStorage` class) for player name and game history
- **Schema**: Drizzle ORM with PostgreSQL dialect configured (ready for database migration)
- **Validation**: Zod schemas for API request validation via `drizzle-zod`

### Build System
- **Client**: Vite builds to `dist/public`
- **Server**: esbuild bundles server code to `dist/index.cjs`
- **Shared Code**: `shared/` directory contains types and schemas used by both client and server

## External Dependencies

### Database
- PostgreSQL via Drizzle ORM (configured but currently using in-memory storage)
- Connection requires `DATABASE_URL` environment variable
- Schema migrations output to `./migrations` directory

### UI Components
- shadcn/ui component library with Radix UI primitives
- Full component set including dialogs, cards, forms, toasts
- Custom CSS variables for theming with light/dark mode support

### Development Tools
- Replit-specific Vite plugins for error overlay, cartographer, and dev banner
- TypeScript with strict mode enabled
- Path aliases: `@/*` for client source, `@shared/*` for shared code

## Key Components

### CartoonPet (client/src/components/CartoonPet.tsx)
- Cartoon-style pet visualization with mood-based facial expressions
- Mood states: sick, sad, neutral, happy, ecstatic - each with unique eyes, mouth, and accessories
- Pet types: dog, cat, rabbit, hamster, bird - each with unique ears/features and body colors
- Sizes: sm, md, lg
- Used on: HomeScreen, DashboardScreen, EndGameScreen

### TrophyBookshelf (client/src/components/TrophyBookshelf.tsx)
- Physical 3D-rendered trophy display on a wooden bookshelf
- Trophy types: bronze (amber), silver (slate), gold (yellow), platinum (cyan)
- Components: TrophyBookshelf (main shelf), PhysicalTrophy (individual trophy), MiniTrophyDisplay (small), LargeTrophyDisplay (large)
- Used on: TrophiesScreen, EndGameScreen

### MinigameRegistry (client/src/components/minigames/MinigameRegistry.tsx)
- 60 unique minigames: 12 per job type (Office, Chef, Engineer, Teacher, Artist)
- getMinigameForWeek() provides seeded random game selection per week
- All minigames use completedRef.current guard to prevent duplicate onComplete calls

## Game Mechanics

### Weekly Living Expenses
- Automatically deducted each week after the random event
- Normal mode: $50/week
- Hard mode: $75/week
- Displayed on dashboard so players can budget accordingly

### Pet Mood System
- Pet expressions change based on health/happiness thresholds:
  - Sick (health < 30): droopy eyes, pale color
  - Sad (happiness < 30): downturned eyes and mouth
  - Neutral (default): normal expression
  - Happy (both >= 60): smile with rosy cheeks
  - Ecstatic (both >= 80): wide eyes, big smile, sparkle accessories

## Recent Changes
- Added weekly living expenses mechanic ($15 normal, $20 hard mode)
- Enhanced all game screens with decorative backgrounds (floating circles, wave SVGs, animated elements)
- Living expenses now shown on dashboard for player awareness