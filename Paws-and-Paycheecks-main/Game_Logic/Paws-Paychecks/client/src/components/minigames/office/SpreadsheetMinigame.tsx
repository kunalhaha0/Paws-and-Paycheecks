import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Table, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

function generateProblem() {
  const a = Math.floor(Math.random() * 50) + 10;
  const b = Math.floor(Math.random() * 50) + 10;
  return { a, b, sum: a + b };
}

export function SpreadsheetMinigame({ onComplete }: Props) {
  const [problems, setProblems] = useState<{ a: number; b: number; sum: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const completedRef = useRef(false);

  useEffect(() => {
    setProblems(Array.from({ length: 8 }, generateProblem));
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

  const handleSubmit = useCallback(() => {
    const current = problems[currentIndex];
    if (parseInt(input) === current.sum) setCorrectCount(prev => prev + 1);
    setInput("");
    if (currentIndex + 1 >= problems.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [input, problems, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Spreadsheet Math</h2>
          <p className="text-muted-foreground">Calculate the sum of each row!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Table className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Calculating</Button>
      </Card>
    );
  }

  if (finished) {
    const score = problems.length > 0 ? Math.round((correctCount / problems.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Spreadsheet Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} calculations correct</p>
        </div>
      </Card>
    );
  }

  const current = problems[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Row {currentIndex + 1} of {problems.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          <div className="p-3 bg-card rounded border">A</div>
          <div className="p-3 bg-card rounded border">B</div>
          <div className="p-3 bg-card rounded border">=SUM</div>
          <div className="p-3 bg-primary/20 rounded border">?</div>
          <div className="p-3 bg-card rounded border text-lg font-bold">{current?.a}</div>
          <div className="p-3 bg-card rounded border text-lg font-bold">{current?.b}</div>
          <div className="p-3 bg-card rounded border">A+B</div>
          <input type="text" value={input} onChange={e => setInput(e.target.value.replace(/\D/g, ""))} autoFocus className="p-3 bg-background rounded border text-lg font-bold text-center" onKeyDown={e => e.key === "Enter" && handleSubmit()} data-testid="input-sum" />
        </div>
      </div>
      <Button onClick={handleSubmit} className="w-full" size="lg" data-testid="button-submit">Enter Sum</Button>
    </Card>
  );
}
