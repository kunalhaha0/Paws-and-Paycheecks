import { useState, useEffect, useCallback, useRef } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

import { HomeScreen } from "@/pages/HomeScreen";
import { QuizScreen } from "@/pages/QuizScreen";
import { DashboardScreen } from "@/pages/DashboardScreen";
import { MinigameScreen } from "@/pages/MinigameScreen";
import { EndGameScreen } from "@/pages/EndGameScreen";
import { TrophiesScreen } from "@/pages/TrophiesScreen";

import { EventModal } from "@/components/EventModal";
import { ShopModal } from "@/components/ShopModal";

import { 
  GameState, 
  GamePhase, 
  JobType, 
  JOBS, 
  GameEvent, 
  ShopItem,
  GameHistory,
  PetType
} from "@shared/schema";
import { 
  createInitialGameState, 
  calculateWeeklyIncome, 
  selectRandomEvent,
  applyEvent,
  applyPurchase,
  applyWeeklyDecay,
  recordWeeklyStats,
  calculateFinalResults,
  TOTAL_WEEKS,
  WEEKLY_LIVING_EXPENSES,
  HARD_MODE_LIVING_EXPENSES
} from "@/lib/gameLogic";

const STORAGE_KEY_NAME = "paws_paychecks_player_name";
const STORAGE_KEY_HISTORY = "paws_paychecks_history";

function Game() {
  const { toast } = useToast();
  
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_NAME) || "";
  });
  
  const [gameHistory, setGameHistory] = useState<GameHistory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [phase, setPhase] = useState<GamePhase>("home");
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [weeklyIncome, setWeeklyIncome] = useState(0);
  const [weeklySpending, setWeeklySpending] = useState(0);
  const [lastIncome, setLastIncome] = useState<number | undefined>();
  const [lastSpending, setLastSpending] = useState<number | undefined>();
  
  const minigameCompletedRef = useRef(false);

  useEffect(() => {
    if (playerName) {
      localStorage.setItem(STORAGE_KEY_NAME, playerName);
    }
  }, [playerName]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(gameHistory));
  }, [gameHistory]);

  const handleStartGame = useCallback((name: string, petName: string, petType: PetType, hardMode: boolean) => {
    setPlayerName(name);
    const newState = createInitialGameState(name, petName, petType, hardMode);
    setGameState(newState);
    setPhase("quiz");
    setWeeklyIncome(0);
    setWeeklySpending(0);
    setLastIncome(undefined);
    setLastSpending(undefined);
    minigameCompletedRef.current = false;
  }, []);

  const handleQuizComplete = useCallback((jobType: JobType) => {
    if (!gameState) return;
    
    const job = JOBS[jobType];
    setGameState(prev => prev ? { ...prev, job, phase: "dashboard" } : null);
    setPhase("dashboard");
    
    toast({
      title: `Welcome, ${job.title}!`,
      description: `Your base salary is $${job.baseSalary} per week.`,
    });
  }, [gameState, toast]);

  const handleStartMinigame = useCallback(() => {
    minigameCompletedRef.current = false;
    setPhase("minigame");
  }, []);

  const handleMinigameComplete = useCallback((score: number) => {
    if (!gameState || !gameState.job) return;
    
    if (minigameCompletedRef.current) return;
    minigameCompletedRef.current = true;

    const income = calculateWeeklyIncome(gameState.job.baseSalary, score, gameState.isHardMode);
    setWeeklyIncome(income);
    
    setGameState(prev => prev ? {
      ...prev,
      wallet: prev.wallet + income,
      minigameScore: score
    } : null);

    toast({
      title: score >= 70 ? "Great work!" : score >= 40 ? "Good effort!" : "Keep practicing!",
      description: `You earned $${income} this week!`,
    });

    setTimeout(() => {
      const event = selectRandomEvent(gameState.isHardMode);
      setCurrentEvent(event);
      setShowEventModal(true);
      setPhase("event");
    }, 1500);
  }, [gameState, toast]);

  const handleEventContinue = useCallback(() => {
    if (!gameState || !currentEvent) return;

    const updatedState = applyEvent(gameState, currentEvent);
    const decayedState = applyWeeklyDecay(updatedState);
    
    const livingExpenses = gameState.isHardMode ? HARD_MODE_LIVING_EXPENSES : WEEKLY_LIVING_EXPENSES;
    const afterExpensesState = {
      ...decayedState,
      wallet: decayedState.wallet - livingExpenses
    };
    setWeeklySpending(prev => prev + livingExpenses);
    
    setGameState(afterExpensesState);
    setShowEventModal(false);
    setCurrentEvent(null);
    setShowShopModal(true);
    setPhase("shop");
    
    toast({
      title: "Weekly Living Expenses",
      description: `$${livingExpenses} deducted for rent, utilities, and essentials.`,
    });
  }, [gameState, currentEvent, toast]);

  const handlePurchase = useCallback((item: ShopItem) => {
    if (!gameState) return;
    
    if (gameState.wallet < item.cost) {
      toast({
        title: "Not enough money!",
        description: "You can't afford this item.",
        variant: "destructive"
      });
      return;
    }

    const updatedState = applyPurchase(gameState, item.cost, item.healthBonus, item.happinessBonus);
    setGameState(updatedState);
    setWeeklySpending(prev => prev + item.cost);

    toast({
      title: `Bought ${item.name}!`,
      description: `Your pet ${item.healthBonus > 0 ? "feels healthier" : ""}${item.healthBonus > 0 && item.happinessBonus > 0 ? " and " : ""}${item.happinessBonus > 0 ? "is happier" : ""}!`,
    });
  }, [gameState, toast]);

  const handleCloseShop = useCallback(() => {
    if (!gameState) return;

    const finalState = recordWeeklyStats(gameState, weeklyIncome, weeklySpending);
    setLastIncome(weeklyIncome);
    setLastSpending(weeklySpending);
    setWeeklyIncome(0);
    setWeeklySpending(0);
    setShowShopModal(false);

    if (finalState.week >= TOTAL_WEEKS) {
      setGameState(finalState);
      setPhase("endgame");
      
      const results = calculateFinalResults(finalState);
      const newHistory: GameHistory = {
        id: Date.now().toString(),
        playerName: finalState.playerName,
        petName: finalState.petName,
        petType: finalState.petType,
        job: finalState.job!.type,
        finalScore: results.score,
        trophy: results.trophy,
        isHardMode: finalState.isHardMode,
        completedAt: new Date().toISOString(),
        totalIncome: results.totalIncome,
        totalSpending: results.totalSpending,
        finalHealth: results.finalHealth,
        finalHappiness: results.finalHappiness,
        finalBalance: results.finalBalance
      };
      setGameHistory(prev => [...prev, newHistory]);
    } else {
      setGameState({ ...finalState, week: finalState.week + 1 });
      setPhase("dashboard");
    }
  }, [gameState, weeklyIncome, weeklySpending]);

  const handlePlayAgain = useCallback(() => {
    setGameState(null);
    setPhase("home");
  }, []);

  const handleViewTrophies = useCallback(() => {
    setPhase("trophies");
  }, []);

  const handleBackToHome = useCallback(() => {
    setPhase("home");
    setGameState(null);
  }, []);

  return (
    <>
      {phase === "home" && (
        <HomeScreen
          playerName={playerName}
          onStartGame={handleStartGame}
          onViewTrophies={handleViewTrophies}
        />
      )}

      {phase === "quiz" && (
        <QuizScreen onComplete={handleQuizComplete} />
      )}

      {phase === "dashboard" && gameState && (
        <DashboardScreen
          gameState={gameState}
          onStartMinigame={handleStartMinigame}
          onOpenShop={() => setShowShopModal(true)}
          lastIncome={lastIncome}
          lastSpending={lastSpending}
        />
      )}

      {phase === "minigame" && gameState && gameState.job && (
        <MinigameScreen
          jobType={gameState.job.type}
          week={gameState.week}
          onComplete={handleMinigameComplete}
        />
      )}

      {phase === "endgame" && gameState && (
        <EndGameScreen
          gameState={gameState}
          onPlayAgain={handlePlayAgain}
          onViewTrophies={handleViewTrophies}
        />
      )}

      {phase === "trophies" && (
        <TrophiesScreen
          history={gameHistory}
          onBack={handleBackToHome}
        />
      )}

      <EventModal
        event={currentEvent}
        open={showEventModal}
        onContinue={handleEventContinue}
      />

      {gameState && (
        <ShopModal
          open={showShopModal && !showEventModal}
          wallet={gameState.wallet}
          onPurchase={handlePurchase}
          onClose={handleCloseShop}
        />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Game />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
