import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles, Trophy, CheckCircle, AlertCircle, Check } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const ITEMS = [
  { name: "Dirty Pan", location: "sink" },
  { name: "Cutting Board", location: "sink" },
  { name: "Used Towel", location: "laundry" },
  { name: "Empty Bottle", location: "trash" },
  { name: "Food Scraps", location: "trash" },
  { name: "Apron", location: "laundry" },
  { name: "Mixing Bowl", location: "sink" },
  { name: "Paper Waste", location: "trash" },
];

export function CleanupMinigame({ onComplete }: Props) {
  const [items, setItems] = useState<typeof ITEMS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const completedRef = useRef(false);

  useEffect(() => {
    setItems([...ITEMS].sort(() => Math.random() - 0.5).slice(0, 6));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && items.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / items.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, items.length, onComplete]);

  const handleSelect = useCallback((location: string) => {
    if (location === items[currentIndex].location) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= items.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [items, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Kitchen Cleanup</h2>
          <p className="text-muted-foreground">Sort items to the right place!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Cleaning</Button>
      </Card>
    );
  }

  if (finished) {
    const score = items.length > 0 ? Math.round((correctCount / items.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Kitchen Clean!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} items sorted correctly</p>
        </div>
      </Card>
    );
  }

  const current = items[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Item {currentIndex + 1} of {items.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground mb-2">Where does this go?</p>
        <p className="text-3xl font-bold text-foreground">{current?.name}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" onClick={() => handleSelect("sink")} className="h-14 flex-col" data-testid="location-sink">
          <span className="text-lg">Sink</span>
          <span className="text-xs text-muted-foreground">To Wash</span>
        </Button>
        <Button variant="outline" onClick={() => handleSelect("trash")} className="h-14 flex-col" data-testid="location-trash">
          <span className="text-lg">Trash</span>
          <span className="text-xs text-muted-foreground">Dispose</span>
        </Button>
        <Button variant="outline" onClick={() => handleSelect("laundry")} className="h-14 flex-col" data-testid="location-laundry">
          <span className="text-lg">Laundry</span>
          <span className="text-xs text-muted-foreground">Fabric</span>
        </Button>
      </div>
    </Card>
  );
}
