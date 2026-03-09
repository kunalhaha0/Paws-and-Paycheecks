import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calculator, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type Equation = { id: number; equation: string; isCorrect: boolean; };

const generateEquations = (): Equation[] => {
  const equations: Equation[] = [];
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const op = ["+", "-", "*"][Math.floor(Math.random() * 3)];
    let correctAnswer: number;
    if (op === "+") correctAnswer = a + b;
    else if (op === "-") correctAnswer = a - b;
    else correctAnswer = a * b;
    const isCorrect = Math.random() > 0.5;
    const shownAnswer = isCorrect ? correctAnswer : correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
    equations.push({ id: i, equation: `${a} ${op} ${b} = ${shownAnswer}`, isCorrect });
  }
  return equations;
};

export function MatchingMinigame({ onComplete }: Props) {
  const [equations, setEquations] = useState<Equation[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setEquations(generateEquations());
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && equations.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / equations.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, equations.length, onComplete]);

  const handleAnswer = useCallback((answer: boolean) => {
    if (equations[currentIndex].isCorrect === answer) {
      setCorrectCount(prev => prev + 1);
    }
    if (currentIndex + 1 >= equations.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [equations, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Quick Math Grading</h2>
          <p className="text-muted-foreground">Grade equations as TRUE or FALSE!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Calculator className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Grading</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / equations.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Grading Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} / {equations.length} graded correctly</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Question {currentIndex + 1} of {equations.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center space-y-6">
        <div className="text-4xl font-mono font-bold text-foreground py-8" data-testid="text-equation">
          {equations[currentIndex]?.equation}
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => handleAnswer(true)} size="lg" variant="outline" className="px-8" data-testid="button-true">TRUE</Button>
          <Button onClick={() => handleAnswer(false)} size="lg" variant="outline" className="px-8" data-testid="button-false">FALSE</Button>
        </div>
      </div>
    </Card>
  );
}
