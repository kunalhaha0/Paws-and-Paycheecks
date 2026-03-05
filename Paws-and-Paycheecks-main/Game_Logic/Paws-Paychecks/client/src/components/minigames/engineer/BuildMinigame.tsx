import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Hammer, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const PARTS = ["Base", "Frame", "Motor", "Wiring", "Cover"];

export function BuildMinigame({ onComplete }: Props) {
  const [parts, setParts] = useState<string[]>([]);
  const [assembled, setAssembled] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const completedRef = useRef(false);

  useEffect(() => {
    setParts([...PARTS].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (started && assembled.length === PARTS.length) setFinished(true);
  }, [assembled.length, started]);

  useEffect(() => {
    if (finished && !completedRef.current) {
      completedRef.current = true;
      const score = Math.round((correctOrder / PARTS.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctOrder, onComplete]);

  const handlePart = useCallback((part: string) => {
    const expectedPart = PARTS[assembled.length];
    if (part === expectedPart) setCorrectOrder(prev => prev + 1);
    setAssembled(prev => [...prev, part]);
    setParts(prev => prev.filter(p => p !== part));
  }, [assembled.length]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Assembly Line</h2>
          <p className="text-muted-foreground">Assemble parts in order: Base - Frame - Motor - Wiring - Cover</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Hammer className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Building</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctOrder / PARTS.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Assembly Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctOrder} / {PARTS.length} in correct order</p>
        </div>
      </Card>
    );
  }

  const progress = (assembled.length / PARTS.length) * 100;

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{assembled.length} / {PARTS.length} assembled</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 5 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <Progress value={progress} className="h-3" />
      <p className="text-center text-muted-foreground">Order: Base - Frame - Motor - Wiring - Cover</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {parts.map(part => (
          <Button key={part} variant="outline" onClick={() => handlePart(part)} className="h-14 px-6" data-testid={`part-${part}`}>
            {part}
          </Button>
        ))}
      </div>
      {assembled.length > 0 && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Assembled:</p>
          <div className="flex gap-2">
            {assembled.map((p, i) => (
              <span key={i} className="px-2 py-1 bg-primary/20 rounded text-sm">{p}</span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
