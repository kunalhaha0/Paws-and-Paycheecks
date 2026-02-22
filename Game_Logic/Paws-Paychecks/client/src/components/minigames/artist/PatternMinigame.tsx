import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Grid3X3, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

const GRID_COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#EAB308", "#A855F7", "#EC4899"];

export function PatternMinigame({ onComplete }: Props) {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [phase, setPhase] = useState<"memorize" | "input">("memorize");
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const totalRounds = 5;
  const completedRef = useRef(false);

  const generatePattern = useCallback((length: number) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 6));
  }, []);

  useEffect(() => {
    if (started && currentRound < totalRounds) {
      const newPattern = generatePattern(3 + currentRound);
      setPattern(newPattern);
      setUserPattern([]);
      setPhase("memorize");
      
      let i = 0;
      const interval = setInterval(() => {
        if (i < newPattern.length) {
          setHighlightIndex(newPattern[i]);
          setTimeout(() => setHighlightIndex(-1), 400);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setPhase("input"), 500);
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [started, currentRound, generatePattern]);

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

  const handleColorClick = useCallback((colorIndex: number) => {
    if (phase !== "input") return;
    const newUserPattern = [...userPattern, colorIndex];
    setUserPattern(newUserPattern);

    const currentIdx = newUserPattern.length - 1;
    if (newUserPattern[currentIdx] !== pattern[currentIdx]) {
      if (currentRound + 1 >= totalRounds) {
        setFinished(true);
      } else {
        setCurrentRound(prev => prev + 1);
      }
      return;
    }

    if (newUserPattern.length === pattern.length) {
      setScore(prev => prev + 1);
      if (currentRound + 1 >= totalRounds) {
        setFinished(true);
      } else {
        setCurrentRound(prev => prev + 1);
      }
    }
  }, [phase, userPattern, pattern, currentRound]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Pattern Memory</h2>
          <p className="text-muted-foreground">Watch the pattern, then recreate it!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Grid3X3 className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Memory
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / totalRounds) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Memory Test Complete!</h2>
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
            {score} / {totalRounds} patterns memorized
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Round {currentRound + 1} of {totalRounds}
        </div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
          {timeLeft}s
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-medium mb-2">
          {phase === "memorize" ? "Watch the pattern..." : "Repeat the pattern!"}
        </p>
        <p className="text-sm text-muted-foreground">
          {phase === "input" && `${userPattern.length} / ${pattern.length}`}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {GRID_COLORS.map((color, i) => (
          <button
            key={i}
            onClick={() => handleColorClick(i)}
            disabled={phase !== "input"}
            className={cn(
              "aspect-square rounded-xl transition-all duration-200",
              highlightIndex === i && "scale-110 ring-4 ring-white shadow-xl",
              phase === "input" && "hover:scale-105"
            )}
            style={{
              backgroundColor: color,
              opacity: highlightIndex === i ? 1 : 0.7,
            }}
            data-testid={`pattern-color-${i}`}
          />
        ))}
      </div>
    </Card>
  );
}
