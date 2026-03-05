import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const MEMOS = [
  { keyword: "meeting", options: ["meeting", "meating", "meting", "meetng"] },
  { keyword: "deadline", options: ["deadlin", "deadline", "dedline", "deadlne"] },
  { keyword: "important", options: ["importent", "improtant", "important", "importnt"] },
  { keyword: "schedule", options: ["schedule", "schedual", "scedule", "schedle"] },
  { keyword: "budget", options: ["budgit", "buget", "budget", "budjet"] },
  { keyword: "review", options: ["reveiw", "review", "reviw", "revew"] },
];

export function MemoMinigame({ onComplete }: Props) {
  const [memos, setMemos] = useState<typeof MEMOS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...MEMOS].sort(() => Math.random() - 0.5);
    setMemos(shuffled);
  }, []);

  useEffect(() => {
    if (memos.length > 0 && currentIndex < memos.length) {
      setShuffledOptions([...memos[currentIndex].options].sort(() => Math.random() - 0.5));
    }
  }, [currentIndex, memos]);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && memos.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / memos.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, memos.length, onComplete]);

  const handleSelect = useCallback((option: string) => {
    const current = memos[currentIndex];
    if (option === current.keyword) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= memos.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [memos, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Memo Writing</h2>
          <p className="text-muted-foreground">Find the correctly spelled word!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Writing</Button>
      </Card>
    );
  }

  if (finished) {
    const score = memos.length > 0 ? Math.round((correctCount / memos.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Memo Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} words spelled correctly</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Word {currentIndex + 1} of {memos.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <p className="text-center text-lg text-foreground">Which spelling is correct?</p>
      <div className="grid grid-cols-2 gap-3">
        {shuffledOptions.map((opt, i) => (
          <Button key={i} variant="outline" onClick={() => handleSelect(opt)} className="h-14 text-lg font-mono" data-testid={`option-${i}`}>
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
}
