import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CartoonPet } from "@/components/CartoonPet";
import { StatBar } from "@/components/StatBar";
import { WalletDisplay } from "@/components/WalletDisplay";
import { WeekCounter, WeekProgressBar } from "@/components/WeekCounter";
import { GameState, JOBS } from "@shared/schema";
import { TOTAL_WEEKS, WEEKLY_LIVING_EXPENSES, HARD_MODE_LIVING_EXPENSES } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";
import { Play, ShoppingBag, Sparkles, AlertTriangle } from "lucide-react";

interface DashboardScreenProps {
  gameState: GameState;
  onStartMinigame: () => void;
  onOpenShop: () => void;
  lastIncome?: number;
  lastSpending?: number;
}

export function DashboardScreen({ 
  gameState, 
  onStartMinigame, 
  onOpenShop,
  lastIncome,
  lastSpending 
}: DashboardScreenProps) {
  const { pet, wallet, week, job, isHardMode, petType } = gameState;

  const isLowHealth = pet.health < 40;
  const isLowHappiness = pet.happiness < 40;
  const isLowWallet = wallet < 20;
  const isNegativeWallet = wallet < 0;

  return (
    <div className={cn(
      "min-h-screen p-4 transition-colors relative overflow-hidden",
      isNegativeWallet ? "bg-gradient-to-b from-red-50 to-background dark:from-red-950/20" :
      isLowHealth || isLowHappiness ? "bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20" :
      "bg-gradient-to-b from-background to-primary/5"
    )} data-testid="screen-dashboard">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-primary/3" />
        <div className="absolute top-1/4 right-10 w-8 h-8 rounded-full bg-amber-400/20 animate-pulse" />
        <div className="absolute bottom-1/3 left-10 w-6 h-6 rounded-full bg-green-400/20 animate-pulse" style={{ animationDelay: "0.7s" }} />
        <div className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-pink-400/15" />
        <svg className="absolute bottom-0 left-0 right-0 h-32 text-primary/5" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-player-greeting">
              Hi, {gameState.playerName}!
            </h1>
            {job && (
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-sm" data-testid="badge-job-title">
                  {job.title}
                </Badge>
                {isHardMode && (
                  <Badge variant="outline" className="text-amber-600 border-amber-300 dark:border-amber-700" data-testid="badge-hard-mode">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Hard Mode
                  </Badge>
                )}
              </div>
            )}
          </div>
          <WeekCounter currentWeek={week} />
        </div>

        <Card className="p-6" data-testid="card-week-progress">
          <WeekProgressBar currentWeek={week} />
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className={cn(
            "p-6 text-center",
            isLowHealth && "ring-2 ring-amber-400",
            isLowHappiness && "ring-2 ring-amber-400"
          )} data-testid="card-pet-status">
            <CartoonPet 
              health={pet.health} 
              happiness={pet.happiness} 
              petName={gameState.petName}
              petType={petType}
              size="lg"
              showStats={false}
            />

            <div className="mt-6 space-y-4">
              <StatBar 
                label="Health" 
                value={pet.health} 
                type="health"
              />
              <StatBar 
                label="Happiness" 
                value={pet.happiness} 
                type="happiness"
              />
            </div>

            {(isLowHealth || isLowHappiness) && (
              <div className="mt-4 p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2" data-testid="warning-pet-needs">
                <AlertTriangle className="w-4 h-4" />
                Your pet needs attention! Visit the shop to help.
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className={cn(
              "p-6",
              isNegativeWallet && "ring-2 ring-red-400",
              isLowWallet && !isNegativeWallet && "ring-2 ring-amber-400"
            )} data-testid="card-wallet">
              <WalletDisplay 
                balance={wallet} 
                showChange={lastIncome ? lastIncome - (lastSpending || 0) : undefined}
                size="lg"
              />

              {isNegativeWallet && (
                <div className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm flex items-center gap-2" data-testid="warning-debt">
                  <AlertTriangle className="w-4 h-4" />
                  Warning: You're in debt! Earn more money to recover.
                </div>
              )}

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weekly living costs:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium" data-testid="text-living-expenses">
                    ${isHardMode ? HARD_MODE_LIVING_EXPENSES : WEEKLY_LIVING_EXPENSES}/week
                  </span>
                </div>
              </div>

              {lastIncome !== undefined && (
                <div className="mt-2 pt-2 border-t space-y-2" data-testid="section-last-week">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last income:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium" data-testid="text-last-income">+${lastIncome}</span>
                  </div>
                  {lastSpending !== undefined && lastSpending > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last spending:</span>
                      <span className="text-red-600 dark:text-red-400 font-medium" data-testid="text-last-spending">-${lastSpending}</span>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card className="p-6 space-y-4" data-testid="card-actions">
              <h3 className="font-semibold text-foreground">Actions</h3>
              
              <Button
                onClick={onStartMinigame}
                size="lg"
                className="w-full"
                data-testid="button-start-work"
              >
                <Play className="w-5 h-5 mr-2" />
                Go to Work (Week {week})
              </Button>

              <Button
                onClick={onOpenShop}
                variant="outline"
                size="lg"
                className="w-full"
                data-testid="button-open-shop"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Pet Shop
              </Button>
            </Card>

            {week === TOTAL_WEEKS && (
              <Card className="p-6 bg-primary/10 border-primary/30" data-testid="card-final-week">
                <p className="text-center text-primary font-medium">
                  Final week! Make it count!
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
