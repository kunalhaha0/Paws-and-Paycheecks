import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartoonPet } from "@/components/CartoonPet";
import { LargeTrophyDisplay } from "@/components/TrophyBookshelf";
import { GameState } from "@shared/schema";
import { calculateFinalResults } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";
import { Home, Trophy, TrendingUp, TrendingDown, Heart, Smile, Wallet } from "lucide-react";

interface EndGameScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onViewTrophies: () => void;
}

export function EndGameScreen({ gameState, onPlayAgain, onViewTrophies }: EndGameScreenProps) {
  const results = calculateFinalResults(gameState);
  const { trophy, totalIncome, totalSpending, finalBalance, finalHealth, finalHappiness, score } = results;

  const getEndMessage = () => {
    if (trophy === "platinum") return "Legendary pet parent! You mastered Hard Mode!";
    if (trophy === "gold") return "Outstanding! You're a natural pet parent!";
    if (trophy === "silver") return "Great job! Your pet was well cared for!";
    if (trophy === "bronze") return "Good effort! Your pet appreciated you!";
    if (finalHealth < 50 || finalHappiness < 50) return "Your pet needs more love next time...";
    if (finalBalance < 0) return "Watch those finances next time!";
    return "Better luck next time!";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden" data-testid="screen-endgame">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-24 h-24 rounded-full bg-amber-500/10 animate-pulse" />
        <div className="absolute top-20 right-10 w-16 h-16 rounded-full bg-primary/10" />
        <div className="absolute bottom-40 left-10 w-20 h-20 rounded-full bg-green-500/10 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 right-1/4 w-32 h-32 rounded-full bg-primary/5" />
        {trophy !== "none" && (
          <>
            <div className="absolute top-1/4 left-10 text-amber-400/30 text-4xl animate-pulse">&#9733;</div>
            <div className="absolute top-1/3 right-20 text-amber-400/20 text-2xl animate-pulse" style={{ animationDelay: "0.5s" }}>&#9733;</div>
            <div className="absolute bottom-1/3 left-20 text-amber-400/25 text-3xl animate-pulse" style={{ animationDelay: "1.2s" }}>&#9733;</div>
          </>
        )}
        <svg className="absolute bottom-0 left-0 right-0 h-40 text-primary/5" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>
      
      <div className="max-w-lg w-full space-y-8 relative z-10">
        <div className="text-center space-y-4 slide-up">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-game-complete">Game Complete!</h1>
          <p className="text-xl text-muted-foreground" data-testid="text-end-message">{getEndMessage()}</p>
        </div>

        <Card className="p-6 pop-in" data-testid="card-results">
          <div className="text-center space-y-6">
            <LargeTrophyDisplay type={trophy} />
            
            <div className="flex justify-center">
              <CartoonPet 
                health={finalHealth} 
                happiness={finalHappiness} 
                petName={gameState.petName}
                petType={gameState.petType}
                size="md"
              />
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Final Score</div>
              <div className="text-4xl font-bold text-primary" data-testid="text-final-score">
                {Math.round(score)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4" data-testid="card-summary">
          <h3 className="font-semibold text-lg text-foreground text-center">Summary</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-center" data-testid="stat-total-income">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <div className="text-xs text-muted-foreground">Total Income</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                ${totalIncome}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-center" data-testid="stat-total-spending">
              <TrendingDown className="w-6 h-6 mx-auto mb-2 text-red-600 dark:text-red-400" />
              <div className="text-xs text-muted-foreground">Total Spending</div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                ${totalSpending}
              </div>
            </div>

            <div className={cn(
              "p-4 rounded-lg text-center",
              finalBalance >= 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-red-100 dark:bg-red-900/30"
            )} data-testid="stat-final-balance">
              <Wallet className={cn(
                "w-6 h-6 mx-auto mb-2",
                finalBalance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
              )} />
              <div className="text-xs text-muted-foreground">Final Balance</div>
              <div className={cn(
                "text-xl font-bold",
                finalBalance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"
              )}>
                ${finalBalance}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-center" data-testid="stat-pet-stats">
              <div className="flex justify-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-500" />
                <Smile className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-xs text-muted-foreground">Pet Stats</div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {finalHealth} / {finalHappiness}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={onPlayAgain}
            size="lg"
            className="w-full"
            data-testid="button-play-again"
          >
            <Home className="w-5 h-5 mr-2" />
            Play Again
          </Button>

          <Button
            onClick={onViewTrophies}
            variant="outline"
            size="lg"
            className="w-full"
            data-testid="button-view-trophies-end"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Trophy Shelf
          </Button>
        </div>
      </div>
    </div>
  );
}
