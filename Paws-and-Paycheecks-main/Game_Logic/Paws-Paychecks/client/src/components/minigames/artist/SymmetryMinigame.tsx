import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FlipHorizontal, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

type SymmetryPattern = {
  original: boolean[][];
  options: boolean[][][];
  correctIndex: number;
};

function generatePattern(): boolean[][] {
  const size = 4;
  const half: boolean[][] = [];
  for (let i = 0; i < size; i++) {
    half.push([Math.random() > 0.5, Math.random() > 0.5]);
  }
  return half.map(row => [...row, ...row.slice().reverse()]);
}

function mirrorPattern(pattern: boolean[][]): boolean[][] {
  return pattern.map(row => [...row].reverse());
}

function shufflePattern(pattern: boolean[][]): boolean[][] {
  const result = pattern.map(row => [...row]);
  const changes = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < changes; i++) {
    const r = Math.floor(Math.random() * result.length);
    const c = Math.floor(Math.random() * result[0].length);
    result[r][c] = !result[r][c];
  }
  return result;
}

function generateRound(): SymmetryPattern {
  const original = generatePattern();
  const correct = mirrorPattern(original);
  const wrong1 = shufflePattern(correct);
  const wrong2 = shufflePattern(correct);
  const wrong3 = shufflePattern(correct);

  const options = [correct, wrong1, wrong2, wrong3];
  const correctIndex = 0;
  
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    original,
    options,
    correctIndex: options.indexOf(correct),
  };
}

export function SymmetryMinigame({ onComplete }: Props) {
  const [rounds, setRounds] = useState<SymmetryPattern[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<number | null>(null);
  const completedRef = useRef(false);
  const totalRounds = 5;

  useEffect(() => {
    const generated = Array.from({ length: totalRounds }, () => generateRound());
    setRounds(generated);
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

  const handleSelect = useCallback((index: number) => {
    if (feedback !== null) return;
    const current = rounds[currentRound];
    const isCorrect = index === current.correctIndex;

    setFeedback(index);
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 >= totalRounds) {
        setFinished(true);
      } else {
        setCurrentRound(prev => prev + 1);
      }
    }, 700);
  }, [rounds, currentRound, feedback]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Symmetry Match</h2>
          <p className="text-muted-foreground">Find the horizontally mirrored pattern!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <FlipHorizontal className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Matching
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / totalRounds) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Symmetry Complete!</h2>
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
            {score} / {totalRounds} matches found
          </p>
        </div>
      </Card>
    );
  }

  const current = rounds[currentRound];

  const renderGrid = (pattern: boolean[][], size: number = 8) => (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${pattern[0]?.length || 4}, 1fr)` }}>
      {pattern.flat().map((filled, i) => (
        <div
          key={i}
          className={cn(
            "aspect-square rounded-sm",
            filled ? "bg-primary" : "bg-muted"
          )}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );

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

      <div className="text-center space-y-4">
        <p className="text-lg font-medium">Find the mirror of:</p>
        <div className="inline-block p-4 bg-muted/50 rounded-xl">
          {current?.original && renderGrid(current.original, 12)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {current?.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={feedback !== null}
            className={cn(
              "p-4 rounded-xl border-2 flex items-center justify-center transition-all",
              feedback === null && "hover:border-primary",
              feedback !== null && i === current.correctIndex && "border-green-500 bg-green-500/10",
              feedback === i && i !== current.correctIndex && "border-red-500 bg-red-500/10"
            )}
            data-testid={`symmetry-option-${i}`}
          >
            {renderGrid(option, 10)}
          </button>
        ))}
      </div>
    </Card>
  );
}
