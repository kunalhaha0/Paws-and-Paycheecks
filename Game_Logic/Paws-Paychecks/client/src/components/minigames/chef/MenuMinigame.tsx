import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClipboardList, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const DISHES = [
  { name: "Caesar Salad", type: "appetizer" },
  { name: "Tomato Soup", type: "appetizer" },
  { name: "Grilled Salmon", type: "main" },
  { name: "Beef Steak", type: "main" },
  { name: "Chocolate Cake", type: "dessert" },
  { name: "Ice Cream", type: "dessert" },
  { name: "French Fries", type: "side" },
  { name: "Mashed Potatoes", type: "side" },
];

export function MenuMinigame({ onComplete }: Props) {
  const [dishes, setDishes] = useState<typeof DISHES>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const completedRef = useRef(false);

  useEffect(() => {
    setDishes([...DISHES].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && dishes.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / dishes.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, dishes.length, onComplete]);

  const handleSelect = useCallback((type: string) => {
    if (type === dishes[currentIndex].type) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= dishes.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [dishes, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Menu Matching</h2>
          <p className="text-muted-foreground">Categorize each dish correctly!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <ClipboardList className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Sorting</Button>
      </Card>
    );
  }

  if (finished) {
    const score = dishes.length > 0 ? Math.round((correctCount / dishes.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Menu Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} dishes categorized correctly</p>
        </div>
      </Card>
    );
  }

  const current = dishes[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Dish {currentIndex + 1} of {dishes.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground mb-2">What category?</p>
        <p className="text-3xl font-bold text-foreground">{current?.name}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {["appetizer", "main", "dessert", "side"].map(type => (
          <Button key={type} variant="outline" onClick={() => handleSelect(type)} className="h-12 capitalize" data-testid={`type-${type}`}>
            {type}
          </Button>
        ))}
      </div>
    </Card>
  );
}
