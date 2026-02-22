import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Palette, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

const COLORS = [
  { name: "Crimson", hex: "#DC143C" },
  { name: "Royal Blue", hex: "#4169E1" },
  { name: "Forest Green", hex: "#228B22" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Purple", hex: "#800080" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Teal", hex: "#008080" },
  { name: "Magenta", hex: "#FF00FF" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Navy", hex: "#000080" },
];

export function ColorMinigame({ onComplete }: Props) {
  const [rounds, setRounds] = useState<typeof COLORS>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 6);
    setRounds(shuffled);
  }, []);

  useEffect(() => {
    if (rounds.length > 0 && currentRound < rounds.length) {
      const target = rounds[currentRound];
      const others = COLORS.filter(c => c.hex !== target.hex)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const allOptions = [target, ...others].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    }
  }, [rounds, currentRound]);

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
    if (finished && !completedRef.current && rounds.length > 0) {
      completedRef.current = true;
      const finalScore = Math.round((score / rounds.length) * 100);
      setTimeout(() => onComplete(finalScore), 1500);
    }
  }, [finished, score, rounds.length, onComplete]);

  const handleColorClick = useCallback((hex: string) => {
    if (feedback) return;
    const target = rounds[currentRound];
    const isCorrect = hex === target.hex;

    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 >= rounds.length) {
        setFinished(true);
      } else {
        setCurrentRound(prev => prev + 1);
      }
    }, 500);
  }, [rounds, currentRound, feedback]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Color Match</h2>
          <p className="text-muted-foreground">Match the target color from the palette!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Palette className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Matching
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / rounds.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Gallery Complete!</h2>
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
            {score} / {rounds.length} colors matched
          </p>
        </div>
      </Card>
    );
  }

  const target = rounds[currentRound];

  return (
    <Card className="p-6 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Color {currentRound + 1} of {rounds.length}
        </div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
          {timeLeft}s
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-lg font-medium">Find: {target?.name}</p>
        <div
          className="w-24 h-24 mx-auto rounded-xl shadow-lg border-4 border-white"
          style={{ backgroundColor: target?.hex }}
          data-testid="target-color"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((color, i) => (
          <button
            key={color.hex}
            onClick={() => handleColorClick(color.hex)}
            disabled={!!feedback}
            className={cn(
              "h-20 rounded-xl shadow-md border-2 border-transparent transition-all",
              feedback && color.hex === target?.hex && "ring-4 ring-green-500",
              feedback === "wrong" && color.hex !== target?.hex && "opacity-50"
            )}
            style={{ backgroundColor: color.hex }}
            data-testid={`color-option-${i}`}
          />
        ))}
      </div>
    </Card>
  );
}
