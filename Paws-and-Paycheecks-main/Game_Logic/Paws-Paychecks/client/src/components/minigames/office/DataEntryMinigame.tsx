import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Database, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const NUMBERS = [
  { id: 1, display: "1,234", value: "1234" },
  { id: 2, display: "5,678", value: "5678" },
  { id: 3, display: "9,012", value: "9012" },
  { id: 4, display: "3,456", value: "3456" },
  { id: 5, display: "7,890", value: "7890" },
  { id: 6, display: "2,468", value: "2468" },
  { id: 7, display: "1,357", value: "1357" },
  { id: 8, display: "8,024", value: "8024" },
];

export function DataEntryMinigame({ onComplete }: Props) {
  const [numbers, setNumbers] = useState<typeof NUMBERS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...NUMBERS].sort(() => Math.random() - 0.5);
    setNumbers(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && numbers.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / numbers.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, numbers.length, onComplete]);

  const handleSubmit = useCallback(() => {
    const current = numbers[currentIndex];
    if (input === current.value) setCorrectCount(prev => prev + 1);
    setInput("");
    if (currentIndex + 1 >= numbers.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [input, numbers, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Data Entry</h2>
          <p className="text-muted-foreground">Type the numbers exactly as shown (without commas)!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Database className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Entry</Button>
      </Card>
    );
  }

  if (finished) {
    const score = numbers.length > 0 ? Math.round((correctCount / numbers.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Entry Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} entries correct</p>
        </div>
      </Card>
    );
  }

  const current = numbers[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Entry {currentIndex + 1} of {numbers.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-2">Enter this number:</p>
        <div className="text-5xl font-bold font-mono text-foreground">{current?.display}</div>
      </div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value.replace(/\D/g, ""))} autoFocus className="flex-1 px-4 py-3 text-xl text-center font-mono border-2 rounded-lg focus:outline-none focus:border-primary bg-background" placeholder="Type numbers..." onKeyDown={e => e.key === "Enter" && handleSubmit()} data-testid="input-data" />
        <Button onClick={handleSubmit} size="lg" data-testid="button-submit">Submit</Button>
      </div>
    </Card>
  );
}
