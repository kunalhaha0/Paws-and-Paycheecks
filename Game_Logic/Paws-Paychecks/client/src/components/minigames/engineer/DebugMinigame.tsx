import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bug, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const BUGS = [
  { code: "console.log('Hello)", error: "Missing closing quote", line: 1 },
  { code: "if (x = 5) {}", error: "Assignment instead of comparison", line: 1 },
  { code: "for (i = 0; i < 10; i++", error: "Missing closing parenthesis", line: 1 },
  { code: "function test[] {}", error: "Wrong brackets for function", line: 1 },
  { code: "return value", error: "Missing semicolon", line: 1 },
  { code: "const x = [1, 2, 3}", error: "Mismatched brackets", line: 1 },
];

export function DebugMinigame({ onComplete }: Props) {
  const [bugs, setBugs] = useState<typeof BUGS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [options, setOptions] = useState<string[]>([]);
  const completedRef = useRef(false);

  useEffect(() => {
    setBugs([...BUGS].sort(() => Math.random() - 0.5).slice(0, 5));
  }, []);

  useEffect(() => {
    if (bugs.length > 0 && currentIndex < bugs.length) {
      const correct = bugs[currentIndex].error;
      const others = BUGS.map(b => b.error).filter(e => e !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
      setOptions([correct, ...others].sort(() => Math.random() - 0.5));
    }
  }, [currentIndex, bugs]);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && bugs.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / bugs.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, bugs.length, onComplete]);

  const handleSelect = useCallback((error: string) => {
    if (error === bugs[currentIndex].error) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= bugs.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [bugs, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Bug Finding</h2>
          <p className="text-muted-foreground">Find the bug in each code snippet!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Bug className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Debugging</Button>
      </Card>
    );
  }

  if (finished) {
    const score = bugs.length > 0 ? Math.round((correctCount / bugs.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Debugging Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} bugs found correctly</p>
        </div>
      </Card>
    );
  }

  const current = bugs[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Bug {currentIndex + 1} of {bugs.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="p-4 bg-gray-900 rounded-lg">
        <code className="text-red-400 font-mono">{current?.code}</code>
      </div>
      <p className="text-center text-muted-foreground">What's wrong with this code?</p>
      <div className="grid grid-cols-1 gap-2">
        {options.map((opt, i) => (
          <Button key={i} variant="outline" onClick={() => handleSelect(opt)} className="h-12 text-left justify-start" data-testid={`error-${i}`}>
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
}
