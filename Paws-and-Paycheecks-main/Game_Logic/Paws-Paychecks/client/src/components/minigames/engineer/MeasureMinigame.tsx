import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Ruler, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

export function MeasureMinigame({ onComplete }: Props) {
  const [measurements, setMeasurements] = useState<{ target: number; width: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const completedRef = useRef(false);

  useEffect(() => {
    const items = Array.from({ length: 6 }, () => {
      const target = Math.floor(Math.random() * 8) + 2;
      return { target, width: target * 20 };
    });
    setMeasurements(items);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && measurements.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / measurements.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, measurements.length, onComplete]);

  const handleSubmit = useCallback(() => {
    if (parseInt(input) === measurements[currentIndex].target) setCorrectCount(prev => prev + 1);
    setInput("");
    if (currentIndex + 1 >= measurements.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [input, measurements, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Precise Measurement</h2>
          <p className="text-muted-foreground">Measure the length in units (each mark = 1 unit)!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Ruler className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Measuring</Button>
      </Card>
    );
  }

  if (finished) {
    const score = measurements.length > 0 ? Math.round((correctCount / measurements.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Measuring Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} measurements correct</p>
        </div>
      </Card>
    );
  }

  const current = measurements[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Measurement {currentIndex + 1} of {measurements.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="h-8 bg-primary rounded" style={{ width: `${current?.width}px` }} />
        <div className="flex mt-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-5 h-3 border-l border-muted-foreground flex items-end">
              <span className="text-xs text-muted-foreground -ml-1">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value.replace(/\D/g, ""))} autoFocus className="flex-1 px-4 py-3 text-xl text-center border-2 rounded-lg focus:outline-none focus:border-primary bg-background" placeholder="Length in units" onKeyDown={e => e.key === "Enter" && handleSubmit()} data-testid="input-measure" />
        <Button onClick={handleSubmit} size="lg" data-testid="button-submit">Submit</Button>
      </div>
    </Card>
  );
}
