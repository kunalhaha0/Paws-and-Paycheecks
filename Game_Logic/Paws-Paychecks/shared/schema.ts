import { z } from "zod";

export type JobType = "office" | "chef" | "engineer" | "teacher" | "artist";

export type PetType = "dog" | "cat" | "rabbit" | "hamster" | "bird";

export const PET_TYPES: { type: PetType; name: string }[] = [
  { type: "dog", name: "Dog" },
  { type: "cat", name: "Cat" },
  { type: "rabbit", name: "Rabbit" },
  { type: "hamster", name: "Hamster" },
  { type: "bird", name: "Bird" }
];

export interface Job {
  type: JobType;
  title: string;
  baseSalary: number;
  description: string;
}

export const JOBS: Record<JobType, Job> = {
  office: {
    type: "office",
    title: "Office Worker",
    baseSalary: 100,
    description: "Work in a busy office typing reports and solving problems"
  },
  chef: {
    type: "chef",
    title: "Chef",
    baseSalary: 90,
    description: "Cook delicious meals in a fast-paced kitchen"
  },
  engineer: {
    type: "engineer",
    title: "Engineer",
    baseSalary: 120,
    description: "Design and build amazing things with technical skills"
  },
  teacher: {
    type: "teacher",
    title: "Teacher",
    baseSalary: 85,
    description: "Educate and inspire students every day"
  },
  artist: {
    type: "artist",
    title: "Artist",
    baseSalary: 75,
    description: "Create beautiful art and express creativity"
  }
};

export interface QuizQuestion {
  id: number;
  question: string;
  options: { text: string; jobPoints: Partial<Record<JobType, number>> }[];
}

export const APTITUDE_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "What sounds like the most fun activity?",
    options: [
      { text: "Organizing files and spreadsheets", jobPoints: { office: 2 } },
      { text: "Experimenting with new recipes", jobPoints: { chef: 2 } },
      { text: "Building something with your hands", jobPoints: { engineer: 2 } },
      { text: "Helping a friend understand something", jobPoints: { teacher: 2 } },
      { text: "Drawing or painting", jobPoints: { artist: 2 } }
    ]
  },
  {
    id: 2,
    question: "How do you prefer to solve problems?",
    options: [
      { text: "Make a detailed plan and follow it", jobPoints: { office: 2, engineer: 1 } },
      { text: "Trust my instincts and improvise", jobPoints: { chef: 2, artist: 1 } },
      { text: "Analyze the data and find patterns", jobPoints: { engineer: 2 } },
      { text: "Talk it through with others", jobPoints: { teacher: 2 } },
      { text: "Try creative approaches", jobPoints: { artist: 2 } }
    ]
  },
  {
    id: 3,
    question: "What's your ideal work environment?",
    options: [
      { text: "A quiet office with a computer", jobPoints: { office: 2 } },
      { text: "A busy kitchen with lots of action", jobPoints: { chef: 2 } },
      { text: "A workshop with tools and equipment", jobPoints: { engineer: 2 } },
      { text: "A classroom full of students", jobPoints: { teacher: 2 } },
      { text: "A studio with art supplies", jobPoints: { artist: 2 } }
    ]
  },
  {
    id: 4,
    question: "What motivates you most?",
    options: [
      { text: "Completing tasks efficiently", jobPoints: { office: 2 } },
      { text: "Creating something delicious", jobPoints: { chef: 2 } },
      { text: "Solving complex challenges", jobPoints: { engineer: 2 } },
      { text: "Making a difference in lives", jobPoints: { teacher: 2 } },
      { text: "Expressing myself creatively", jobPoints: { artist: 2 } }
    ]
  },
  {
    id: 5,
    question: "What skill are you most proud of?",
    options: [
      { text: "Being organized and reliable", jobPoints: { office: 2 } },
      { text: "Having great taste and timing", jobPoints: { chef: 2 } },
      { text: "Understanding how things work", jobPoints: { engineer: 2 } },
      { text: "Communicating clearly", jobPoints: { teacher: 2 } },
      { text: "Seeing beauty in everything", jobPoints: { artist: 2 } }
    ]
  }
];

export type EventType = 
  | "vet_emergency" 
  | "broken_toy" 
  | "work_bonus" 
  | "tax_refund" 
  | "minor_illness" 
  | "friend_gift" 
  | "normal_week";

export interface GameEvent {
  type: EventType;
  name: string;
  description: string;
  balanceEffect: [number, number];
  healthEffect: number;
  happinessEffect: number;
  probability: number;
  isPositive: boolean;
}

export const GAME_EVENTS: GameEvent[] = [
  {
    type: "vet_emergency",
    name: "Vet Emergency!",
    description: "Your pet ate something they shouldn't have and needs urgent care!",
    balanceEffect: [-50, -20],
    healthEffect: -5,
    happinessEffect: 0,
    probability: 10,
    isPositive: false
  },
  {
    type: "broken_toy",
    name: "Broken Toy",
    description: "Your pet's favorite toy broke and needs to be replaced.",
    balanceEffect: [-20, -10],
    healthEffect: 0,
    happinessEffect: -5,
    probability: 15,
    isPositive: false
  },
  {
    type: "work_bonus",
    name: "Work Bonus!",
    description: "Great news! Your hard work was recognized with a bonus!",
    balanceEffect: [20, 50],
    healthEffect: 0,
    happinessEffect: 5,
    probability: 10,
    isPositive: true
  },
  {
    type: "tax_refund",
    name: "Tax Refund!",
    description: "You received an unexpected tax refund!",
    balanceEffect: [10, 30],
    healthEffect: 0,
    happinessEffect: 0,
    probability: 5,
    isPositive: true
  },
  {
    type: "minor_illness",
    name: "Minor Illness",
    description: "Your pet caught a small cold and is feeling under the weather.",
    balanceEffect: [0, 0],
    healthEffect: -5,
    happinessEffect: -5,
    probability: 10,
    isPositive: false
  },
  {
    type: "friend_gift",
    name: "Gift from Friend",
    description: "A friend stopped by with a special treat for your pet!",
    balanceEffect: [0, 0],
    healthEffect: 0,
    happinessEffect: 5,
    probability: 10,
    isPositive: true
  },
  {
    type: "normal_week",
    name: "Peaceful Week",
    description: "A quiet, uneventful week. Sometimes that's the best kind!",
    balanceEffect: [0, 0],
    healthEffect: 0,
    happinessEffect: 0,
    probability: 40,
    isPositive: true
  }
];

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  healthBonus: number;
  happinessBonus: number;
  category: "food" | "healthcare" | "toys" | "housing";
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "basic_food", name: "Basic Food", description: "Simple but nutritious pet food", cost: 10, healthBonus: 10, happinessBonus: 2, category: "food" },
  { id: "premium_food", name: "Premium Food", description: "High-quality organic pet food", cost: 25, healthBonus: 20, happinessBonus: 5, category: "food" },
  { id: "treats", name: "Tasty Treats", description: "Delicious snacks your pet loves", cost: 8, healthBonus: 3, happinessBonus: 10, category: "food" },
  { id: "vitamins", name: "Pet Vitamins", description: "Keep your pet healthy and strong", cost: 15, healthBonus: 15, happinessBonus: 0, category: "healthcare" },
  { id: "checkup", name: "Vet Checkup", description: "Regular health examination", cost: 30, healthBonus: 25, happinessBonus: -5, category: "healthcare" },
  { id: "medicine", name: "Medicine", description: "Cure minor ailments", cost: 20, healthBonus: 20, happinessBonus: 0, category: "healthcare" },
  { id: "basic_toy", name: "Basic Toy", description: "A simple toy for playtime", cost: 10, healthBonus: 0, happinessBonus: 12, category: "toys" },
  { id: "fancy_toy", name: "Fancy Toy", description: "An exciting interactive toy", cost: 25, healthBonus: 2, happinessBonus: 20, category: "toys" },
  { id: "bed", name: "Cozy Bed", description: "A comfortable place to rest", cost: 35, healthBonus: 10, happinessBonus: 15, category: "housing" },
  { id: "cleaning", name: "Deep Cleaning", description: "Keep the living space fresh", cost: 15, healthBonus: 8, happinessBonus: 8, category: "housing" }
];

export type TrophyType = "none" | "bronze" | "silver" | "gold" | "platinum";

export interface Trophy {
  type: TrophyType;
  name: string;
  description: string;
  minScore: number;
}

export const TROPHIES: Trophy[] = [
  { type: "platinum", name: "Platinum Paw", description: "Legendary pet parent in Hard Mode!", minScore: 95 },
  { type: "gold", name: "Golden Bone", description: "Outstanding pet care and finances!", minScore: 85 },
  { type: "silver", name: "Silver Whisker", description: "Great balance of care and savings!", minScore: 70 },
  { type: "bronze", name: "Bronze Collar", description: "Good pet parenting skills!", minScore: 50 }
];

export interface Pet {
  name: string;
  type: PetType;
  health: number;
  happiness: number;
}

export interface GameState {
  playerName: string;
  petName: string;
  petType: PetType;
  pet: Pet;
  wallet: number;
  week: number;
  job: Job | null;
  isHardMode: boolean;
  weeklyStats: WeeklyStats[];
  phase: GamePhase;
  minigameScore: number;
}

export interface WeeklyStats {
  week: number;
  income: number;
  spending: number;
  endHealth: number;
  endHappiness: number;
  endBalance: number;
}

export type GamePhase = 
  | "home" 
  | "quiz" 
  | "dashboard" 
  | "minigame" 
  | "event" 
  | "shop" 
  | "endgame"
  | "trophies"
  | "settings";

export interface GameHistory {
  id: string;
  playerName: string;
  petName: string;
  petType: PetType;
  job: JobType;
  finalScore: number;
  trophy: TrophyType;
  isHardMode: boolean;
  completedAt: string;
  totalIncome: number;
  totalSpending: number;
  finalHealth: number;
  finalHappiness: number;
  finalBalance: number;
}

export const insertGameHistorySchema = z.object({
  playerName: z.string().min(1),
  petName: z.string().min(1),
  petType: z.enum(["dog", "cat", "rabbit", "hamster", "bird"]),
  job: z.enum(["office", "chef", "engineer", "teacher", "artist"]),
  finalScore: z.number(),
  trophy: z.enum(["none", "bronze", "silver", "gold", "platinum"]),
  isHardMode: z.boolean(),
  totalIncome: z.number(),
  totalSpending: z.number(),
  finalHealth: z.number(),
  finalHappiness: z.number(),
  finalBalance: z.number()
});

export type InsertGameHistory = z.infer<typeof insertGameHistorySchema>;

export const playerSettingsSchema = z.object({
  playerName: z.string().min(1).max(20)
});

export type PlayerSettings = z.infer<typeof playerSettingsSchema>;

export const PET_NAMES = [
  "Buddy", "Luna", "Max", "Bella", "Charlie", "Daisy", "Cooper", "Sadie",
  "Milo", "Chloe", "Rocky", "Zoey", "Bear", "Lily", "Duke", "Penny",
  "Tucker", "Molly", "Jack", "Rosie", "Teddy", "Ruby", "Oliver", "Coco"
];

export function getRandomPetName(): string {
  return PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)];
}

export function calculateTrophyScore(
  totalIncome: number,
  maxPossibleIncome: number,
  avgHealth: number,
  avgHappiness: number
): number {
  const incomeScore = (totalIncome / maxPossibleIncome) * 40;
  const healthScore = (avgHealth / 100) * 30;
  const happinessScore = (avgHappiness / 100) * 30;
  return incomeScore + healthScore + happinessScore;
}

export function getTrophyForScore(score: number, isHardMode: boolean): TrophyType {
  if (isHardMode && score >= 95) return "platinum";
  if (score >= 85) return "gold";
  if (score >= 70) return "silver";
  if (score >= 50) return "bronze";
  return "none";
}
