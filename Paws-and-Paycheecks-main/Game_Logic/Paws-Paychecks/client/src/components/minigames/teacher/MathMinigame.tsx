import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calculator, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type MathProblem = { question: string; answer: number; options: number[]; };

const generateProblems = (): MathProblem[] => {
  const problems: MathProblem[] = [];
  for (let i = 0; i < 10; i++) {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const opType = Math.floor(Math.random() * 3);
    let question: string;
    let answer: number;
    if (opType === 0) {
      question = `${a} + ${b}`;
      answer = a + b;
    } else if (opType === 1) {
      const larger = Math.max(a, b);
      const smaller = Math.min(a, b);
      question = `${larger} - ${smaller}`;
      answer = larger - smaller;
    } else {
      question = `${a} x ${b}`;
      answer = a * b;
    }
    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 10) - 5;
      if (offset !== 0 && answer + offset >= 0) wrongAnswers.add(answer + offset);
    }
    const options = [answer, ...Array.from(wrongAnswers)].sort(() => Math.random() - 0.5);
    problems.push({ question, answer, options });
  }
  return problems;
};

export function MathMinigame({ onComplete }: Props) {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setProblems(generateProblems());
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

  const handleAnswer = useCallback((selectedAnswer: number) => {
    if (selectedAnswer === problems[currentIndex].answer) {
      setCorrectCount(prev => prev + 1);
    }
    if (currentIndex + 1 >= problems.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [problems, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Math Challenge</h2>
          <p className="text-muted-foreground">Solve arithmetic problems as fast as you can!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Calculator className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Math</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / problems.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Math Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} / {problems.length} solved correctly</p>
        </div>
      </Card>
    );
  }

  const current = problems[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Problem {currentIndex + 1} of {problems.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center space-y-6">
        <div className="text-5xl font-mono font-bold text-foreground py-6" data-testid="text-problem">
          {current?.question} = ?
        </div>
        <div className="grid grid-cols-2 gap-3">
          {current?.options.map((option, i) => (
            <Button key={i} onClick={() => handleAnswer(option)} variant="outline" size="lg" className="text-2xl font-mono" data-testid={`button-option-${i}`}>
              {option}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
