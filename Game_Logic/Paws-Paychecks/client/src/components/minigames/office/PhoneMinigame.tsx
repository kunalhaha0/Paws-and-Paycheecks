import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Phone, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const CONTACTS = [
  { name: "John Smith", dept: "Sales" },
  { name: "Jane Doe", dept: "Marketing" },
  { name: "Bob Wilson", dept: "Engineering" },
  { name: "Alice Brown", dept: "HR" },
  { name: "Tom Davis", dept: "Finance" },
  { name: "Sara Lee", dept: "Support" },
];

export function PhoneMinigame({ onComplete }: Props) {
  const [requests, setRequests] = useState<{ name: string; dept: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const [options, setOptions] = useState<string[]>([]);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...CONTACTS].sort(() => Math.random() - 0.5).slice(0, 6);
    setRequests(shuffled);
  }, []);

  useEffect(() => {
    if (requests.length > 0 && currentIndex < requests.length) {
      const correct = requests[currentIndex].dept;
      const depts = [...new Set(CONTACTS.map(c => c.dept))];
      const others = depts.filter(d => d !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
      setOptions([correct, ...others].sort(() => Math.random() - 0.5));
    }
  }, [currentIndex, requests]);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && requests.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / requests.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, requests.length, onComplete]);

  const handleSelect = useCallback((dept: string) => {
    if (dept === requests[currentIndex].dept) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= requests.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [requests, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Phone Directory</h2>
          <p className="text-muted-foreground">Connect callers to the right department!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Phone className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Connecting</Button>
      </Card>
    );
  }

  if (finished) {
    const score = requests.length > 0 ? Math.round((correctCount / requests.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Calls Routed!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} calls connected correctly</p>
        </div>
      </Card>
    );
  }

  const current = requests[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Call {currentIndex + 1} of {requests.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <Phone className="w-8 h-8 mx-auto mb-2 text-primary" />
        <p className="text-lg font-medium text-foreground">Incoming call from {current?.name}</p>
        <p className="text-muted-foreground">Connect to which department?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <Button key={i} variant="outline" onClick={() => handleSelect(opt)} className="h-12" data-testid={`dept-${i}`}>
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
}
