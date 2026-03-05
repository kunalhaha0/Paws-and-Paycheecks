import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Thermometer, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const TEMPS = [
  { food: "Chicken", safeTemp: 165, options: [145, 155, 165, 175] },
  { food: "Beef Steak", safeTemp: 145, options: [125, 135, 145, 165] },
  { food: "Pork", safeTemp: 145, options: [125, 145, 155, 165] },
  { food: "Fish", safeTemp: 145, options: [125, 135, 145, 155] },
  { food: "Ground Beef", safeTemp: 160, options: [140, 150, 160, 170] },
  { food: "Eggs", safeTemp: 160, options: [140, 150, 160, 170] },
];

export function TemperatureMinigame({ onComplete }: Props) {
  const [temps, setTemps] = useState<typeof TEMPS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const completedRef = useRef(false);

  useEffect(() => {
    setTemps([...TEMPS].sort(() => Math.random() - 0.5).slice(0, 6));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && temps.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / temps.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, temps.length, onComplete]);

  const handleSelect = useCallback((temp: number) => {
    if (temp === temps[currentIndex].safeTemp) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= temps.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [temps, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Temperature Control</h2>
          <p className="text-muted-foreground">Select the safe cooking temperature!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Thermometer className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Testing</Button>
      </Card>
    );
  }

  if (finished) {
    const score = temps.length > 0 ? Math.round((correctCount / temps.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Temperature Test Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} temperatures correct</p>
        </div>
      </Card>
    );
  }

  const current = temps[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Food {currentIndex + 1} of {temps.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <Thermometer className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <p className="text-muted-foreground mb-2">Safe temp for:</p>
        <p className="text-3xl font-bold text-foreground">{current?.food}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {current?.options.map((temp, i) => (
          <Button key={i} variant="outline" onClick={() => handleSelect(temp)} className="h-14 text-xl" data-testid={`temp-${i}`}>
            {temp}°F
          </Button>
        ))}
      </div>
    </Card>
  );
}
