import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Keyboard, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const WORDS = ["report", "meeting", "email", "deadline", "project", "document", "schedule", "budget", "office", "client", "proposal", "contract", "invoice", "analysis", "review"];

export function TypingMinigame({ onComplete }: Props) {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, 10));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && words.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / words.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, words.length, onComplete]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInput(value);
    if (value === words[currentIndex]) {
      setCorrectCount(prev => prev + 1);
      setCurrentIndex(prev => prev + 1);
      setInput("");
      if (currentIndex + 1 >= words.length) setFinished(true);
    }
  }, [words, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Speed Typing</h2>
          <p className="text-muted-foreground">Type office words as fast as you can!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Keyboard className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Typing</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / words.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Time's Up!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} / {words.length} words typed correctly</p>
        </div>
      </Card>
    );
  }

  const currentWord = words[currentIndex];
  const progress = (currentIndex / words.length) * 100;

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Word {currentIndex + 1} of {words.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="text-center space-y-4">
        <div className="text-4xl font-mono font-bold tracking-wider text-foreground">
          {currentWord?.split("").map((char, i) => (
            <span key={i} className={cn(i < input.length && input[i] === char && "text-green-500", i < input.length && input[i] !== char && "text-destructive")}>{char}</span>
          ))}
        </div>
        <input type="text" value={input} onChange={handleInput} autoFocus className="w-full max-w-xs mx-auto px-4 py-3 text-xl text-center font-mono border-2 rounded-lg focus:outline-none focus:border-primary bg-background" placeholder="Type here..." data-testid="input-typing" />
      </div>
    </Card>
  );
}
