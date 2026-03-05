import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LayoutGrid, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

const TILE_COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#EAB308"];

function generateTarget(): number[] {
  return Array.from({ length: 9 }, () => Math.floor(Math.random() * 4));
}

export function MosaicMinigame({ onComplete }: Props) {
  const [targets, setTargets] = useState<number[][]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerGrid, setPlayerGrid] = useState<number[]>(Array(9).fill(0));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const completedRef = useRef(false);
  const totalRounds = 4;

  useEffect(() => {
    const generated = Array.from({ length: totalRounds }, () => generateTarget());
    setTargets(generated);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current) {
      completedRef.current = true;
      const finalScore = Math.round((score / totalRounds) * 100);
      setTimeout(() => onComplete(finalScore), 1500);
    }
  }, [finished, score, onComplete]);

  const handleTileClick = useCallback((index: number) => {
    if (feedback) return;
    setPlayerGrid(prev => {
      const newGrid = [...prev];
      newGrid[index] = (newGrid[index] + 1) % 4;
      return newGrid;
    });
  }, [feedback]);

  const handleSubmit = useCallback(() => {
    if (feedback) return;
    const target = targets[currentRound];
    const isCorrect = playerGrid.every((tile, i) => tile === target[i]);

    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      setPlayerGrid(Array(9).fill(0));
      if (currentRound + 1 >= totalRounds) {
        setFinished(true);
      } else {
        setCurrentRound(prev => prev + 1);
      }
    }, 800);
  }, [targets, currentRound, playerGrid, feedback]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Mosaic Match</h2>
          <p className="text-muted-foreground">Recreate the target pattern by clicking tiles!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <LayoutGrid className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Mosaic
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / totalRounds) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Mosaic Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {finalScore >= 70 ? (
            <Trophy className="w-10 h-10 text-yellow-500" />
          ) : finalScore >= 40 ? (
            <CheckCircle className="w-10 h-10 text-green-500" />
          ) : (
            <AlertCircle className="w-10 h-10 text-amber-500" />
          )}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">
            {finalScore}%
          </div>
          <p className="text-muted-foreground">
            {score} / {totalRounds} mosaics matched
          </p>
        </div>
      </Card>
    );
  }

  const target = targets[currentRound];

  const renderGrid = (grid: number[], interactive: boolean = false) => (
    <div className="grid grid-cols-3 gap-1.5 w-full max-w-[140px]">
      {grid.map((colorIdx, i) => (
        <button
          key={i}
          onClick={interactive ? () => handleTileClick(i) : undefined}
          disabled={!interactive || !!feedback}
          className={cn(
            "aspect-square rounded-md transition-all",
            interactive && "hover:scale-105"
          )}
          style={{ backgroundColor: TILE_COLORS[colorIdx] }}
          data-testid={interactive ? `tile-${i}` : undefined}
        />
      ))}
    </div>
  );

  return (
    <Card className="p-6 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Pattern {currentRound + 1} of {totalRounds}
        </div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
          {timeLeft}s
        </div>
      </div>

      <div className="flex justify-around items-center">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Target</p>
          {target && renderGrid(target)}
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Your Mosaic</p>
          {renderGrid(playerGrid, true)}
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {TILE_COLORS.map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Click tiles to cycle through colors
      </p>

      <Button onClick={handleSubmit} disabled={!!feedback} className="w-full" data-testid="button-submit">
        Check Match
      </Button>
    </Card>
  );
}
