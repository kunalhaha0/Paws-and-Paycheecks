import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Gauge, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const PROBLEMS = [
  { scenario: "Power usage is 150W, needs to be under 100W", options: ["Reduce load", "Increase voltage", "Add more power"], correct: "Reduce load" },
  { scenario: "System running at 40% efficiency", options: ["Add cooling", "Remove bottleneck", "Increase speed"], correct: "Remove bottleneck" },
  { scenario: "Memory usage at 95%", options: ["Add more RAM", "Clear cache", "Restart system"], correct: "Clear cache" },
  { scenario: "Process taking 10 seconds, needs to be 3 seconds", options: ["Parallelize tasks", "Add logging", "Use slower algorithm"], correct: "Parallelize tasks" },
  { scenario: "Network latency at 500ms", options: ["Use CDN", "Add more data", "Increase packet size"], correct: "Use CDN" },
];

export function OptimizeMinigame({ onComplete }: Props) {
  const [problems, setProblems] = useState<typeof PROBLEMS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const completedRef = useRef(false);

  useEffect(() => {
    setProblems([...PROBLEMS].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && problems.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / problems.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, problems.length, onComplete]);

  const handleSelect = useCallback((option: string) => {
    if (option === problems[currentIndex].correct) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= problems.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [problems, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Optimization</h2>
          <p className="text-muted-foreground">Choose the best solution for each problem!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Gauge className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Optimizing</Button>
      </Card>
    );
  }

  if (finished) {
    const score = problems.length > 0 ? Math.round((correctCount / problems.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Optimization Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} optimizations correct</p>
        </div>
      </Card>
    );
  }

  const current = problems[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Problem {currentIndex + 1} of {problems.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="p-6 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-center">
        <Gauge className="w-8 h-8 mx-auto mb-2 text-amber-600" />
        <p className="text-lg font-medium text-foreground">{current?.scenario}</p>
      </div>
      <div className="space-y-2">
        {current?.options.map((opt, i) => (
          <Button key={i} variant="outline" onClick={() => handleSelect(opt)} className="w-full h-12 justify-start" data-testid={`option-${i}`}>
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
}
