import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Palette, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface ColorMinigameProps {
  onComplete: (score: number) => void;
}

type ColorPalette = {
  name: string;
  colors: string[];
  target: string;
};

const PALETTES: ColorPalette[] = [
  { name: "Sunset", colors: ["#FF6B6B", "#FF8E53", "#FFE66D", "#4ECDC4", "#45B7D1"], target: "#FF8E53" },
  { name: "Ocean", colors: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8", "#023E8A"], target: "#00B4D8" },
  { name: "Forest", colors: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"], target: "#52B788" },
  { name: "Lavender", colors: ["#7B2CBF", "#9D4EDD", "#C77DFF", "#E0AAFF", "#5A189A"], target: "#C77DFF" },
  { name: "Autumn", colors: ["#D62828", "#F77F00", "#FCBF49", "#EAE2B7", "#8B4513"], target: "#F77F00" },
];

export function ColorMinigame({ onComplete }: ColorMinigameProps) {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [shuffledColors, setShuffledColors] = useState<string[]>([]);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...PALETTES].sort(() => Math.random() - 0.5);
    setPalettes(shuffled);
  }, []);

  useEffect(() => {
    if (palettes.length > 0 && currentIndex < palettes.length) {
      const colors = [...palettes[currentIndex].colors].sort(() => Math.random() - 0.5);
      setShuffledColors(colors);
    }
  }, [currentIndex, palettes]);

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
    if (finished && !completedRef.current && palettes.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / palettes.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, palettes.length, onComplete]);

  const handleColorClick = useCallback((color: string) => {
    const current = palettes[currentIndex];
    const isCorrect = color === current.target;
    
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 >= palettes.length) {
        setFinished(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 600);
  }, [palettes, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Color Matching</h2>
          <p className="text-muted-foreground">Match the target color as quickly as possible!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Palette className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Painting
        </Button>
      </Card>
    );
  }

  if (finished) {
    const score = palettes.length > 0 ? Math.round((correctCount / palettes.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Gallery Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : 
           score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : 
           <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">
            {correctCount} / {palettes.length} colors matched
          </p>
        </div>
      </Card>
    );
  }

  const current = palettes[currentIndex];

  return (
    <Card className={cn(
      "p-8 space-y-6 transition-colors",
      feedback === "correct" && "bg-green-50 dark:bg-green-900/20",
      feedback === "wrong" && "bg-red-50 dark:bg-red-900/20"
    )} data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground" data-testid="text-palette-progress">
          Palette {currentIndex + 1} of {palettes.length}
        </div>
        <div className={cn(
          "text-2xl font-bold",
          timeLeft <= 10 ? "text-destructive shake" : "text-foreground"
        )} data-testid="text-time-left">
          {timeLeft}s
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-lg font-medium text-foreground" data-testid="text-palette-name">
          Find this color in the "{current.name}" palette:
        </p>
        <div 
          className="w-24 h-24 mx-auto rounded-lg shadow-lg border-4 border-white dark:border-gray-700"
          style={{ backgroundColor: current.target }}
          data-testid="target-color"
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center py-4">
        {shuffledColors.map((color, i) => (
          <button
            key={i}
            onClick={() => handleColorClick(color)}
            className={cn(
              "w-16 h-16 rounded-lg shadow-md transition-transform hover:scale-110 active:scale-95",
              "border-2 border-white dark:border-gray-700"
            )}
            style={{ backgroundColor: color }}
            disabled={feedback !== null}
            data-testid={`button-color-${i}`}
          />
        ))}
      </div>

      <div className="flex justify-center gap-2">
        {palettes.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full",
              i < currentIndex ? "bg-primary" : i === currentIndex ? "bg-primary animate-pulse" : "bg-muted"
            )}
            data-testid={`palette-indicator-${i}`}
          />
        ))}
      </div>
    </Card>
  );
}
