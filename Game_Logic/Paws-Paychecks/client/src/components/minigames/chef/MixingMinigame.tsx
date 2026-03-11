import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { RefreshCw, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const MIXES = [
  { name: "Cake Batter", targetMixes: 10 },
  { name: "Pancake Mix", targetMixes: 8 },
  { name: "Cookie Dough", targetMixes: 12 },
  { name: "Bread Dough", targetMixes: 15 },
];

export function MixingMinigame({ onComplete }: Props) {
  const [mixes, setMixes] = useState<typeof MIXES>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mixCount, setMixCount] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const completedRef = useRef(false);

  useEffect(() => {
    setMixes([...MIXES].sort(() => Math.random() - 0.5).slice(0, 3));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && mixes.length > 0) {
      completedRef.current = true;
      const score = Math.round((completed / mixes.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, completed, mixes.length, onComplete]);

  const handleMix = useCallback(() => {
    const target = mixes[currentIndex]?.targetMixes || 10;
    if (mixCount + 1 >= target) {
      setCompleted(c => c + 1);
      if (currentIndex + 1 >= mixes.length) setFinished(true);
      else {
        setCurrentIndex(i => i + 1);
        setMixCount(0);
      }
    } else {
      setMixCount(m => m + 1);
    }
  }, [mixCount, mixes, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Mixing Bowl</h2>
          <p className="text-muted-foreground">Mix the ingredients until done!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <RefreshCw className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Mixing</Button>
      </Card>
    );
  }

  if (finished) {
    const score = mixes.length > 0 ? Math.round((completed / mixes.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Mixing Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{completed} mixtures completed</p>
        </div>
      </Card>
    );
  }

  const current = mixes[currentIndex];
  const progress = (mixCount / (current?.targetMixes || 10)) * 100;

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Mix {currentIndex + 1} of {mixes.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 5 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground mb-2">{current?.name}</p>
        <Progress value={progress} className="h-4" />
        <p className="text-sm text-muted-foreground mt-2">{mixCount} / {current?.targetMixes} mixes</p>
      </div>
      <Button onClick={handleMix} size="lg" className="w-full h-20 text-xl" data-testid="button-mix">
        <RefreshCw className="w-8 h-8 mr-2" />MIX!
      </Button>
    </Card>
  );
}
