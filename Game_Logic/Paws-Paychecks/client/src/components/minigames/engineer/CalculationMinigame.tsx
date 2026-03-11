import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calculator, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

function generateProblem() {
  const ops = ["+", "-", "*"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;
  if (op === "+") {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * 50) + 10;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 50) + 50;
    b = Math.floor(Math.random() * 40) + 10;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    answer = a * b;
  }
  return { expression: `${a} ${op} ${b}`, answer };
}

export function CalculationMinigame({ onComplete }: Props) {
  const [problems, setProblems] = useState<{ expression: string; answer: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
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
    if (parseInt(input) === problems[currentIndex].answer) setCorrectCount(prev => prev + 1);
    setInput("");
    if (currentIndex + 1 >= problems.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [input, problems, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Quick Calculation</h2>
          <p className="text-muted-foreground">Solve the engineering math problems!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Calculator className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Calculating</Button>
      </Card>
    );
  }

  if (finished) {
    const score = problems.length > 0 ? Math.round((correctCount / problems.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Calculations Done!</h2>
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
        <div className="text-sm text-muted-foreground">Problem {currentIndex + 1} of {problems.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center py-6">
        <div className="text-5xl font-bold font-mono text-foreground">{current?.expression} = ?</div>
      </div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value.replace(/[^0-9-]/g, ""))} autoFocus className="flex-1 px-4 py-3 text-2xl text-center font-mono border-2 rounded-lg focus:outline-none focus:border-primary bg-background" onKeyDown={e => e.key === "Enter" && handleSubmit()} data-testid="input-answer" />
        <Button onClick={handleSubmit} size="lg" data-testid="button-submit">Submit</Button>
      </div>
    </Card>
  );
}
