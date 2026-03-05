import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Pencil, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

type Point = { x: number; y: number; order: number };

const PATTERNS: Point[][] = [
  [{ x: 50, y: 20, order: 1 }, { x: 80, y: 50, order: 2 }, { x: 50, y: 80, order: 3 }, { x: 20, y: 50, order: 4 }],
  [{ x: 20, y: 20, order: 1 }, { x: 80, y: 20, order: 2 }, { x: 80, y: 80, order: 3 }, { x: 20, y: 80, order: 4 }],
  [{ x: 50, y: 10, order: 1 }, { x: 90, y: 40, order: 2 }, { x: 70, y: 90, order: 3 }, { x: 30, y: 90, order: 4 }, { x: 10, y: 40, order: 5 }],
  [{ x: 10, y: 50, order: 1 }, { x: 35, y: 20, order: 2 }, { x: 65, y: 20, order: 3 }, { x: 90, y: 50, order: 4 }, { x: 65, y: 80, order: 5 }, { x: 35, y: 80, order: 6 }],
];

export function SketchMinigame({ onComplete }: Props) {
  const [patterns, setPatterns] = useState<Point[][]>([]);
  const [currentPattern, setCurrentPattern] = useState(0);
  const [clickedPoints, setClickedPoints] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...PATTERNS].sort(() => Math.random() - 0.5).slice(0, 4);
    setPatterns(shuffled);
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
    if (finished && !completedRef.current && patterns.length > 0) {
      completedRef.current = true;
      const finalScore = Math.round((score / patterns.length) * 100);
      setTimeout(() => onComplete(finalScore), 1500);
    }
  }, [finished, score, patterns.length, onComplete]);

  const handlePointClick = useCallback((order: number) => {
    if (showResult) return;
    const nextExpected = clickedPoints.length + 1;

    if (order === nextExpected) {
      const newClicked = [...clickedPoints, order];
      setClickedPoints(newClicked);

      if (newClicked.length === patterns[currentPattern].length) {
        setShowResult("correct");
        setScore(prev => prev + 1);
        setTimeout(() => {
          setShowResult(null);
          setClickedPoints([]);
          if (currentPattern + 1 >= patterns.length) {
            setFinished(true);
          } else {
            setCurrentPattern(prev => prev + 1);
          }
        }, 800);
      }
    } else {
      setShowResult("wrong");
      setTimeout(() => {
        setShowResult(null);
        setClickedPoints([]);
        if (currentPattern + 1 >= patterns.length) {
          setFinished(true);
        } else {
          setCurrentPattern(prev => prev + 1);
        }
      }, 800);
    }
  }, [clickedPoints, patterns, currentPattern, showResult]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Dot Connect</h2>
          <p className="text-muted-foreground">Connect the dots in the correct order (1, 2, 3...)!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Pencil className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Sketching
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / patterns.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Sketch Complete!</h2>
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
            {score} / {patterns.length} patterns completed
          </p>
        </div>
      </Card>
    );
  }

  const currentPoints = patterns[currentPattern] || [];

  return (
    <Card className="p-6 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Pattern {currentPattern + 1} of {patterns.length}
        </div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
          {timeLeft}s
        </div>
      </div>

      <div className="relative w-full aspect-square bg-muted/30 rounded-xl border-2 border-dashed">
        {currentPoints.map((point, i) => (
          <button
            key={i}
            onClick={() => handlePointClick(point.order)}
            disabled={!!showResult}
            className={cn(
              "absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-bold text-sm transition-all",
              clickedPoints.includes(point.order)
                ? "bg-green-500 text-white scale-110"
                : "bg-card border-2 shadow-md hover:scale-110"
            )}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            data-testid={`dot-${point.order}`}
          >
            {point.order}
          </button>
        ))}

        {showResult && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center rounded-xl",
            showResult === "correct" ? "bg-green-500/20" : "bg-red-500/20"
          )}>
            <span className="text-2xl font-bold">
              {showResult === "correct" ? "Correct!" : "Try again!"}
            </span>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Click dots in order: {clickedPoints.length} / {currentPoints.length}
      </p>
    </Card>
  );
}
