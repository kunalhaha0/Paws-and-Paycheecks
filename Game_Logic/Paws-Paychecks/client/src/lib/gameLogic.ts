import { 
  GameState, 
  GameEvent, 
  GAME_EVENTS, 
  JobType, 
  JOBS, 
  WeeklyStats,
  calculateTrophyScore,
  getTrophyForScore,
  TrophyType,
  APTITUDE_QUIZ,
  PetType
} from "@shared/schema";

export const TOTAL_WEEKS = 12;
export const STARTING_WALLET = 100;
export const HARD_MODE_WALLET = 50;
export const WEEKLY_LIVING_EXPENSES = 50;
export const HARD_MODE_LIVING_EXPENSES = 75;

export function createInitialGameState(
  playerName: string, 
  petName: string,
  petType: PetType,
  isHardMode: boolean
): GameState {
  return {
    playerName,
    petName,
    petType,
    pet: {
      name: petName,
      type: petType,
      health: 80,
      happiness: 80
    },
    wallet: isHardMode ? HARD_MODE_WALLET : STARTING_WALLET,
    week: 1,
    job: null,
    isHardMode,
    weeklyStats: [],
    phase: "quiz",
    minigameScore: 0
  };
}

export function calculateJobFromQuiz(answers: number[]): JobType {
  const scores: Record<JobType, number> = {
    office: 0,
    chef: 0,
    engineer: 0,
    teacher: 0,
    artist: 0
  };

  answers.forEach((answerIndex, questionIndex) => {
    const question = APTITUDE_QUIZ[questionIndex];
    const option = question.options[answerIndex];
    Object.entries(option.jobPoints).forEach(([job, points]) => {
      scores[job as JobType] += points || 0;
    });
  });

  let maxJob: JobType = "office";
  let maxScore = 0;

  Object.entries(scores).forEach(([job, score]) => {
    if (score > maxScore) {
      maxScore = score;
      maxJob = job as JobType;
    }
  });

  return maxJob;
}

export function calculateWeeklyIncome(baseSalary: number, minigameScore: number, isHardMode: boolean): number {
  const performanceMultiplier = 0.5 + (minigameScore / 100) * 1.0;
  let income = Math.round(baseSalary * performanceMultiplier);
  if (isHardMode) {
    income = Math.round(income * 0.75);
  }
  return income;
}

export function selectRandomEvent(isHardMode: boolean): GameEvent {
  const adjustedEvents = GAME_EVENTS.map(event => {
    if (isHardMode && !event.isPositive) {
      return { ...event, probability: event.probability * 1.5 };
    }
    if (isHardMode && event.isPositive && event.type !== "normal_week") {
      return { ...event, probability: event.probability * 0.5 };
    }
    return event;
  });

  const totalProbability = adjustedEvents.reduce((sum, e) => sum + e.probability, 0);
  let random = Math.random() * totalProbability;

  for (const event of adjustedEvents) {
    random -= event.probability;
    if (random <= 0) {
      const balanceChange = event.balanceEffect[0] === event.balanceEffect[1]
        ? event.balanceEffect[0]
        : Math.floor(Math.random() * (event.balanceEffect[1] - event.balanceEffect[0] + 1)) + event.balanceEffect[0];
      
      return {
        ...event,
        balanceEffect: [balanceChange, balanceChange]
      };
    }
  }

  return GAME_EVENTS[GAME_EVENTS.length - 1];
}

export function applyWeeklyDecay(state: GameState): GameState {
  const decayAmount = state.isHardMode ? 8 : 5;
  return {
    ...state,
    pet: {
      ...state.pet,
      health: Math.max(0, state.pet.health - decayAmount),
      happiness: Math.max(0, state.pet.happiness - decayAmount)
    }
  };
}

export function applyEvent(state: GameState, event: GameEvent): GameState {
  const balanceChange = event.balanceEffect[0];
  return {
    ...state,
    wallet: state.wallet + balanceChange,
    pet: {
      ...state.pet,
      health: Math.max(0, Math.min(100, state.pet.health + event.healthEffect)),
      happiness: Math.max(0, Math.min(100, state.pet.happiness + event.happinessEffect))
    }
  };
}

export function applyPurchase(
  state: GameState, 
  cost: number, 
  healthBonus: number, 
  happinessBonus: number
): GameState {
  return {
    ...state,
    wallet: state.wallet - cost,
    pet: {
      ...state.pet,
      health: Math.min(100, state.pet.health + healthBonus),
      happiness: Math.min(100, state.pet.happiness + happinessBonus)
    }
  };
}

export function recordWeeklyStats(state: GameState, income: number, spending: number): GameState {
  const weekStats: WeeklyStats = {
    week: state.week,
    income,
    spending,
    endHealth: state.pet.health,
    endHappiness: state.pet.happiness,
    endBalance: state.wallet
  };

  return {
    ...state,
    weeklyStats: [...state.weeklyStats, weekStats]
  };
}

export function calculateFinalResults(state: GameState) {
  const totalIncome = state.weeklyStats.reduce((sum, w) => sum + w.income, 0);
  const totalSpending = state.weeklyStats.reduce((sum, w) => sum + w.spending, 0);
  const avgHealth = state.weeklyStats.reduce((sum, w) => sum + w.endHealth, 0) / state.weeklyStats.length;
  const avgHappiness = state.weeklyStats.reduce((sum, w) => sum + w.endHappiness, 0) / state.weeklyStats.length;
  
  const maxPossibleIncome = (state.job?.baseSalary || 100) * 1.5 * TOTAL_WEEKS;
  const score = calculateTrophyScore(totalIncome, maxPossibleIncome, avgHealth, avgHappiness);
  
  const canEarnTrophy = state.pet.health >= 50 && state.pet.happiness >= 50 && state.wallet >= 0;
  const trophy: TrophyType = canEarnTrophy ? getTrophyForScore(score, state.isHardMode) : "none";

  return {
    totalIncome,
    totalSpending,
    avgHealth,
    avgHappiness,
    finalBalance: state.wallet,
    finalHealth: state.pet.health,
    finalHappiness: state.pet.happiness,
    score,
    trophy
  };
}

export function getPetMood(health: number, happiness: number): "sick" | "sad" | "neutral" | "happy" | "ecstatic" {
  if (health < 30) return "sick";
  if (happiness < 30) return "sad";
  if (health >= 80 && happiness >= 80) return "ecstatic";
  if (health >= 60 && happiness >= 60) return "happy";
  return "neutral";
}

export function getStatColor(value: number): string {
  if (value >= 70) return "hsl(145 50% 45%)";
  if (value >= 40) return "hsl(45 90% 55%)";
  return "hsl(0 75% 55%)";
}

export function getWalletColor(balance: number): string {
  if (balance < 0) return "hsl(0 75% 55%)";
  if (balance < 30) return "hsl(45 90% 55%)";
  return "hsl(145 50% 45%)";
}
