import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TrophyBookshelf, MiniTrophyDisplay } from "@/components/TrophyBookshelf";
import { GameHistory, JOBS, TrophyType } from "@shared/schema";
import { ArrowLeft, Trophy, Calendar, Briefcase, Sparkles } from "lucide-react";

interface TrophiesScreenProps {
  history: GameHistory[];
  onBack: () => void;
}

export function TrophiesScreen({ history, onBack }: TrophiesScreenProps) {
  const trophies = history.map(h => h.trophy).filter(t => t !== "none") as TrophyType[];
  
  const stats = {
    gamesPlayed: history.length,
    trophiesEarned: trophies.length,
    bestScore: history.length > 0 ? Math.max(...history.map(h => h.finalScore)) : 0,
    totalEarnings: history.reduce((sum, h) => sum + h.totalIncome, 0)
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-background to-amber-50 dark:to-amber-950/10 relative overflow-hidden" data-testid="screen-trophies">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-500/10" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-amber-400/5" />
        <div className="absolute top-1/4 left-10 w-8 h-8 rounded-full bg-amber-400/20 animate-pulse" />
        <div className="absolute bottom-1/4 right-16 w-6 h-6 rounded-full bg-amber-300/20 animate-pulse" style={{ animationDelay: "0.8s" }} />
        <div className="absolute top-1/2 right-1/4 text-amber-400/20 text-2xl">&#9733;</div>
        <div className="absolute bottom-40 left-1/3 text-amber-400/15 text-xl">&#9733;</div>
        <svg className="absolute bottom-0 left-0 right-0 h-32 text-amber-500/5" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,80 C300,40 600,100 900,60 C1050,40 1150,80 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back-home">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2" data-testid="text-trophies-title">
              <Trophy className="w-6 h-6 text-amber-500" />
              Trophy Bookshelf
            </h1>
            <p className="text-muted-foreground">Your achievements and game history</p>
          </div>
        </div>

        <div data-testid="card-trophy-shelf">
          <TrophyBookshelf trophies={trophies} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center" data-testid="stat-games-played">
            <div className="text-3xl font-bold text-foreground">{stats.gamesPlayed}</div>
            <div className="text-sm text-muted-foreground">Games Played</div>
          </Card>
          <Card className="p-4 text-center" data-testid="stat-trophies-earned">
            <div className="text-3xl font-bold text-amber-500">{stats.trophiesEarned}</div>
            <div className="text-sm text-muted-foreground">Trophies Earned</div>
          </Card>
          <Card className="p-4 text-center" data-testid="stat-best-score">
            <div className="text-3xl font-bold text-primary">{Math.round(stats.bestScore)}</div>
            <div className="text-sm text-muted-foreground">Best Score</div>
          </Card>
          <Card className="p-4 text-center" data-testid="stat-total-earnings">
            <div className="text-3xl font-bold text-green-600">${stats.totalEarnings}</div>
            <div className="text-sm text-muted-foreground">Total Earnings</div>
          </Card>
        </div>

        <Card className="p-6" data-testid="card-game-history">
          <h3 className="font-semibold text-lg mb-4 text-foreground">Game History</h3>
          
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="empty-history">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No games completed yet.</p>
              <p className="text-sm">Start a new game to earn trophies!</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {history.slice().reverse().map((game, index) => (
                  <div
                    key={game.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                    data-testid={`history-item-${index}`}
                  >
                    <MiniTrophyDisplay type={game.trophy} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{game.petName}</span>
                        <Badge variant="secondary" className="text-xs">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {JOBS[game.job].title}
                        </Badge>
                        {game.isHardMode && (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Hard
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(game.completedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg text-primary">
                        {Math.round(game.finalScore)}
                      </div>
                      <div className="text-xs text-muted-foreground">score</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full"
          data-testid="button-back-to-home"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
