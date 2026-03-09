import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { List, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const SEQUENCES = [
  { pattern: [2, 4, 6, 8], next: 10, hint: "+2" },
  { pattern: [1, 2, 4, 8], next: 16, hint: "x2" },
  { pattern: [5, 10, 15, 20], next: 25, hint: "+5" },
  { pattern: [3, 6, 12, 24], next: 48, hint: "x2" },
  { pattern: [1, 4, 9, 16], next: 25, hint: "squares" },
  { pattern: [100, 90, 80, 70], next: 60, hint: "-10" },
];

export function SequenceMinigame({ onComplete }: Props) {
  const [sequences, setSequences] = useState<typeof SEQUENCES>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [options, setOptions] = useState<number[]>([]);
  const completedRef = useRef(false);

  useEffect(() => {
    setSequences([...SEQUENCES].sort(() => Math.random() - 0.5).slice(0, 5));
  }, []);

  useEffect(() => {
    if (sequences.length > 0 && currentIndex < sequences.length) {
      const correct = sequences[currentIndex].next;
      const others = [correct - 3, correct + 2, correct - 1, correct + 5].filter(n => n !== correct && n > 0);
      setOptions([correct, ...others.slice(0, 3)].sort(() => Math.random() - 0.5));
    }
  }, [currentIndex, sequences]);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && sequences.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / sequences.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, sequences.length, onComplete]);

  const handleSelect = useCallback((num: number) => {
    if (num === sequences[currentIndex].next) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= sequences.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [sequences, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Pattern Sequence</h2>
          <p className="text-muted-foreground">Find the next number in each sequence!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <List className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Patterns</Button>
      </Card>
    );
  }

  if (finished) {
    const score = sequences.length > 0 ? Math.round((correctCount / sequences.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Patterns Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} sequences correct</p>
        </div>
      </Card>
    );
  }

  const current = sequences[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Sequence {currentIndex + 1} of {sequences.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center">
        <div className="flex justify-center gap-3 mb-4">
          {current?.pattern.map((n, i) => (
            <div key={i} className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-xl font-bold text-primary">{n}</div>
          ))}
          <div className="w-12 h-12 bg-muted border-2 border-dashed border-primary rounded-lg flex items-center justify-center text-xl font-bold text-primary">?</div>
        </div>
        <p className="text-muted-foreground">What comes next?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((num, i) => (
          <Button key={i} variant="outline" onClick={() => handleSelect(num)} className="h-14 text-xl" data-testid={`option-${i}`}>
            {num}
          </Button>
        ))}
      </div>
    </Card>
  );
}
