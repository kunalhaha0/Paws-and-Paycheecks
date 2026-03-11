import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SunMedium, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

type GradientRound = {
  baseColor: string;
  shades: { hex: string; lightness: number }[];
  correctOrder: number[];
};

function generateGradientRound(): GradientRound {
  const hue = Math.floor(Math.random() * 360);
  const shades = [
    { hex: `hsl(${hue}, 70%, 20%)`, lightness: 20 },
    { hex: `hsl(${hue}, 70%, 40%)`, lightness: 40 },
    { hex: `hsl(${hue}, 70%, 60%)`, lightness: 60 },
    { hex: `hsl(${hue}, 70%, 80%)`, lightness: 80 },
  ];
  const correctOrder = [0, 1, 2, 3];
  const shuffledShades = [...shades].sort(() => Math.random() - 0.5);

  return {
    baseColor: `hsl(${hue}, 70%, 50%)`,
    shades: shuffledShades,
    correctOrder: shuffledShades.map(s => shades.findIndex(orig => orig.lightness === s.lightness)),
  };
}

export function GradientMinigame({ onComplete }: Props) {
  const [rounds, setRounds] = useState<GradientRound[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerOrder, setPlayerOrder] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const completedRef = useRef(false);
  const totalRounds = 5;

  useEffect(() => {
    const generated = Array.from({ length: totalRounds }, () => generateGradientRound());
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

  const handleShadeClick = useCallback((index: number) => {
    if (feedback || playerOrder.includes(index)) return;
    setPlayerOrder(prev => [...prev, index]);
  }, [feedback, playerOrder]);

  useEffect(() => {
    if (playerOrder.length === 4 && rounds.length > 0) {
      const current = rounds[currentRound];
      const sortedByLightness = [...current.shades]
        .map((s, i) => ({ ...s, originalIndex: i }))
        .sort((a, b) => a.lightness - b.lightness)
        .map(s => s.originalIndex);

      const isCorrect = playerOrder.every((p, i) => p === sortedByLightness[i]);

      setFeedback(isCorrect ? "correct" : "wrong");
      if (isCorrect) setScore(prev => prev + 1);

      setTimeout(() => {
        setFeedback(null);
        setPlayerOrder([]);
        if (currentRound + 1 >= totalRounds) {
          setFinished(true);
        } else {
          setCurrentRound(prev => prev + 1);
        }
      }, 800);
    }
  }, [playerOrder, rounds, currentRound]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Gradient Order</h2>
          <p className="text-muted-foreground">Order colors from darkest to lightest!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <SunMedium className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Ordering
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / totalRounds) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Gradient Complete!</h2>
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
            {score} / {totalRounds} gradients ordered
          </p>
        </div>
      </Card>
    );
  }

  const current = rounds[currentRound];

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
        <p className="text-lg font-medium mb-2">Order from darkest to lightest</p>
        <p className="text-sm text-muted-foreground">
          Selected: {playerOrder.length} / 4
        </p>
      </div>

      <div className="flex justify-center gap-2 min-h-[60px] p-4 bg-muted/30 rounded-xl">
        {playerOrder.map((idx, i) => (
          <div
            key={i}
            className="w-12 h-12 rounded-lg shadow-md"
            style={{ backgroundColor: current?.shades[idx]?.hex }}
          />
        ))}
        {[...Array(4 - playerOrder.length)].map((_, i) => (
          <div key={`empty-${i}`} className="w-12 h-12 rounded-lg border-2 border-dashed border-muted-foreground/30" />
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {current?.shades.map((shade, i) => (
          <button
            key={i}
            onClick={() => handleShadeClick(i)}
            disabled={!!feedback || playerOrder.includes(i)}
            className={cn(
              "aspect-square rounded-xl shadow-md transition-all",
              playerOrder.includes(i) && "opacity-30 scale-90",
              !playerOrder.includes(i) && !feedback && "hover:scale-105"
            )}
            style={{ backgroundColor: shade.hex }}
            data-testid={`shade-${i}`}
          />
        ))}
      </div>
    </Card>
  );
}
