import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Code, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const SNIPPETS = [
  { code: "if (x > ___) {", answer: "0", options: ["0", "1", "x", "null"] },
  { code: "for (let i = 0; i < ___; i++)", answer: "10", options: ["5", "10", "i", "n"] },
  { code: "console.log(___);", answer: "result", options: ["error", "result", "null", "void"] },
  { code: "return ___ + b;", answer: "a", options: ["a", "b", "c", "x"] },
  { code: "const arr = [1, 2, ___];", answer: "3", options: ["2", "3", "4", "0"] },
  { code: "function ___() {}", answer: "main", options: ["main", "start", "run", "init"] },
];

export function CodeMinigame({ onComplete }: Props) {
  const [snippets, setSnippets] = useState<typeof SNIPPETS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const completedRef = useRef(false);

  useEffect(() => {
    setSnippets([...SNIPPETS].sort(() => Math.random() - 0.5).slice(0, 5));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && snippets.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / snippets.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, snippets.length, onComplete]);

  const handleSelect = useCallback((answer: string) => {
    if (answer === snippets[currentIndex].answer) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= snippets.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [snippets, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Code Completion</h2>
          <p className="text-muted-foreground">Fill in the missing code!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Code className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Coding</Button>
      </Card>
    );
  }

  if (finished) {
    const score = snippets.length > 0 ? Math.round((correctCount / snippets.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Code Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} snippets completed correctly</p>
        </div>
      </Card>
    );
  }

  const current = snippets[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Snippet {currentIndex + 1} of {snippets.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="p-6 bg-gray-900 rounded-lg">
        <code className="text-green-400 font-mono text-xl">{current?.code}</code>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {current?.options.sort(() => Math.random() - 0.5).map((opt, i) => (
          <Button key={i} variant="outline" onClick={() => handleSelect(opt)} className="h-12 font-mono" data-testid={`option-${i}`}>
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
}
