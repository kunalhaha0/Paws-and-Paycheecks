import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Scissors, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const VEGETABLES = ["Carrot", "Onion", "Celery", "Pepper", "Tomato", "Cucumber"];

export function ChoppingMinigame({ onComplete }: Props) {
  const [vegetables, setVegetables] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chopProgress, setChopProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...VEGETABLES].sort(() => Math.random() - 0.5);
    setVegetables(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && vegetables.length > 0) {
      completedRef.current = true;
      const score = Math.round((completed / vegetables.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, completed, vegetables.length, onComplete]);

  const handleChop = useCallback(() => {
    setChopProgress(prev => {
      const next = prev + 20;
      if (next >= 100) {
        setCompleted(c => c + 1);
        if (currentIndex + 1 >= vegetables.length) {
          setFinished(true);
        } else {
          setCurrentIndex(i => i + 1);
        }
        return 0;
      }
      return next;
    });
  }, [currentIndex, vegetables.length]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Speed Chopping</h2>
          <p className="text-muted-foreground">Tap quickly to chop all vegetables!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Scissors className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Chopping</Button>
      </Card>
    );
  }

  if (finished) {
    const score = vegetables.length > 0 ? Math.round((completed / vegetables.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">All Chopped!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{completed} vegetables chopped</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Vegetable {currentIndex + 1} of {vegetables.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 5 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-foreground mb-4">{vegetables[currentIndex]}</p>
        <Progress value={chopProgress} className="h-4" />
      </div>
      <Button onClick={handleChop} size="lg" className="w-full h-20 text-2xl" data-testid="button-chop">
        <Scissors className="w-8 h-8 mr-2" />CHOP!
      </Button>
      <div className="flex justify-center gap-2">
        {vegetables.map((_, i) => (
          <div key={i} className={cn("w-4 h-4 rounded-full", i < completed ? "bg-green-500" : i === currentIndex ? "bg-primary" : "bg-muted")} />
        ))}
      </div>
    </Card>
  );
}
