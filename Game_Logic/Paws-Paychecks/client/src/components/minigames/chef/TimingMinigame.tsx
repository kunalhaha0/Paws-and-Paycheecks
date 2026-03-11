import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Timer, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const FOODS = [
  { name: "Egg", target: 3 },
  { name: "Steak", target: 5 },
  { name: "Rice", target: 4 },
  { name: "Toast", target: 2 },
  { name: "Pasta", target: 6 },
];

export function TimingMinigame({ onComplete }: Props) {
  const [foods, setFoods] = useState<typeof FOODS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [cooking, setCooking] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...FOODS].sort(() => Math.random() - 0.5).slice(0, 4);
    setFoods(shuffled);
  }, []);

  useEffect(() => {
    if (!cooking) return;
    const timer = setInterval(() => setCookTime(prev => prev + 0.1), 100);
    return () => clearInterval(timer);
  }, [cooking]);

  useEffect(() => {
    if (finished && !completedRef.current && foods.length > 0) {
      completedRef.current = true;
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      setTimeout(() => onComplete(Math.round(avgScore)), 1500);
    }
  }, [finished, scores, foods.length, onComplete]);

  const handleStart = useCallback(() => {
    setCooking(true);
    setCookTime(0);
  }, []);

  const handleStop = useCallback(() => {
    setCooking(false);
    const target = foods[currentIndex].target;
    const diff = Math.abs(cookTime - target);
    const accuracy = Math.max(0, 100 - diff * 20);
    setScores(prev => [...prev, accuracy]);
    if (currentIndex + 1 >= foods.length) setFinished(true);
    else {
      setCurrentIndex(prev => prev + 1);
      setCookTime(0);
    }
  }, [cookTime, foods, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Perfect Timing</h2>
          <p className="text-muted-foreground">Stop the timer at exactly the right moment!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Timer className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Cooking</Button>
      </Card>
    );
  }

  if (finished) {
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Cooking Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {avgScore >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : avgScore >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{avgScore}%</div>
          <p className="text-muted-foreground">Average timing accuracy</p>
        </div>
      </Card>
    );
  }

  const current = foods[currentIndex];
  const progress = Math.min((cookTime / 8) * 100, 100);

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="text-sm text-muted-foreground text-center">Dish {currentIndex + 1} of {foods.length}</div>
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground mb-2">{current?.name}</p>
        <p className="text-muted-foreground">Cook for exactly <span className="font-bold text-primary">{current?.target} seconds</span></p>
      </div>
      <div className="space-y-2">
        <Progress value={progress} className={cn("h-6", cookTime > (current?.target || 0) + 1 && "bg-red-200")} />
        <div className="text-center text-3xl font-mono font-bold">{cookTime.toFixed(1)}s</div>
      </div>
      {!cooking ? (
        <Button onClick={handleStart} size="lg" className="w-full" data-testid="button-start-cook">Start Cooking</Button>
      ) : (
        <Button onClick={handleStop} size="lg" className="w-full bg-red-500 hover:bg-red-600" data-testid="button-stop-cook">Stop!</Button>
      )}
    </Card>
  );
}
