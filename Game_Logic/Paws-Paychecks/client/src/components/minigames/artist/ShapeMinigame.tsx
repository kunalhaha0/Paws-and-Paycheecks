import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Shapes, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

type ShapePuzzle = {
  name: string;
  parts: string[];
  correctParts: string[];
  allParts: string[];
};

const SHAPE_PUZZLES: ShapePuzzle[] = [
  {
    name: "House",
    correctParts: ["triangle", "square"],
    parts: ["triangle", "square"],
    allParts: ["triangle", "square", "circle", "diamond"],
  },
  {
    name: "Ice Cream",
    correctParts: ["circle", "triangle"],
    parts: ["circle", "triangle"],
    allParts: ["circle", "triangle", "square", "hexagon"],
  },
  {
    name: "Tree",
    correctParts: ["triangle", "rectangle"],
    parts: ["triangle", "rectangle"],
    allParts: ["triangle", "rectangle", "circle", "diamond"],
  },
  {
    name: "Rocket",
    correctParts: ["triangle", "rectangle", "triangle"],
    parts: ["triangle", "rectangle", "triangle"],
    allParts: ["triangle", "rectangle", "circle", "square"],
  },
  {
    name: "Snowman",
    correctParts: ["circle", "circle", "circle"],
    parts: ["circle", "circle", "circle"],
    allParts: ["circle", "square", "triangle", "hexagon"],
  },
];

const SHAPE_DISPLAY: Record<string, string> = {
  triangle: "△",
  square: "□",
  circle: "○",
  rectangle: "▭",
  diamond: "◇",
  hexagon: "⬡",
};

export function ShapeMinigame({ onComplete }: Props) {
  const [puzzles, setPuzzles] = useState<ShapePuzzle[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...SHAPE_PUZZLES].sort(() => Math.random() - 0.5);
    setPuzzles(shuffled);
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
    if (finished && !completedRef.current && puzzles.length > 0) {
      completedRef.current = true;
      const finalScore = Math.round((score / puzzles.length) * 100);
      setTimeout(() => onComplete(finalScore), 1500);
    }
  }, [finished, score, puzzles.length, onComplete]);

  const handlePartClick = useCallback((part: string) => {
    if (feedback) return;
    setSelectedParts(prev => [...prev, part]);
  }, [feedback]);

  const handleSubmit = useCallback(() => {
    if (feedback) return;
    const current = puzzles[currentPuzzle];
    const isCorrect =
      selectedParts.length === current.correctParts.length &&
      selectedParts.every((p, i) => p === current.correctParts[i]);

    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      setSelectedParts([]);
      if (currentPuzzle + 1 >= puzzles.length) {
        setFinished(true);
      } else {
        setCurrentPuzzle(prev => prev + 1);
      }
    }, 800);
  }, [puzzles, currentPuzzle, selectedParts, feedback]);

  const handleClear = useCallback(() => {
    setSelectedParts([]);
  }, []);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Shape Builder</h2>
          <p className="text-muted-foreground">Build shapes using the correct parts!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Shapes className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Building
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / puzzles.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Building Complete!</h2>
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
            {score} / {puzzles.length} shapes built
          </p>
        </div>
      </Card>
    );
  }

  const current = puzzles[currentPuzzle];

  return (
    <Card className="p-6 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Shape {currentPuzzle + 1} of {puzzles.length}
        </div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
          {timeLeft}s
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-medium">Build a: {current?.name}</p>
        <p className="text-sm text-muted-foreground">
          Select {current?.correctParts.length} shapes in order
        </p>
      </div>

      <div className="min-h-[60px] p-4 bg-muted/50 rounded-xl flex items-center justify-center gap-2 flex-wrap">
        {selectedParts.length === 0 ? (
          <span className="text-muted-foreground">Click shapes below to build...</span>
        ) : (
          selectedParts.map((part, i) => (
            <span key={i} className="text-4xl">
              {SHAPE_DISPLAY[part]}
            </span>
          ))
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {current?.allParts.map((part, i) => (
          <button
            key={`${part}-${i}`}
            onClick={() => handlePartClick(part)}
            disabled={!!feedback}
            className="p-4 rounded-xl border-2 text-3xl hover:border-primary hover:bg-primary/5 transition-all"
            data-testid={`shape-part-${i}`}
          >
            {SHAPE_DISPLAY[part]}
          </button>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={handleClear} disabled={!!feedback} data-testid="button-clear">
          Clear
        </Button>
        <Button onClick={handleSubmit} disabled={!!feedback || selectedParts.length === 0} data-testid="button-submit">
          Submit
        </Button>
      </div>
    </Card>
  );
}
