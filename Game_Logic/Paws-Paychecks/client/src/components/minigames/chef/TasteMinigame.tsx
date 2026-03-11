import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Cookie, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const TASTES = [
  { flavor: "Sweet", examples: ["Sugar", "Honey", "Chocolate"] },
  { flavor: "Salty", examples: ["Salt", "Soy Sauce", "Bacon"] },
  { flavor: "Sour", examples: ["Lemon", "Vinegar", "Yogurt"] },
  { flavor: "Bitter", examples: ["Coffee", "Dark Chocolate", "Kale"] },
  { flavor: "Umami", examples: ["Mushroom", "Parmesan", "Tomato"] },
];

export function TasteMinigame({ onComplete }: Props) {
  const [rounds, setRounds] = useState<{ ingredient: string; flavor: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const completedRef = useRef(false);

  useEffect(() => {
    const allItems: { ingredient: string; flavor: string }[] = [];
    TASTES.forEach(t => t.examples.forEach(e => allItems.push({ ingredient: e, flavor: t.flavor })));
    const shuffled = allItems.sort(() => Math.random() - 0.5).slice(0, 8);
    setRounds(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && rounds.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / rounds.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, rounds.length, onComplete]);

  const handleSelect = useCallback((flavor: string) => {
    if (flavor === rounds[currentIndex].flavor) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= rounds.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [rounds, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Taste Test</h2>
          <p className="text-muted-foreground">Identify the flavor profile of each ingredient!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Cookie className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Tasting</Button>
      </Card>
    );
  }

  if (finished) {
    const score = rounds.length > 0 ? Math.round((correctCount / rounds.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Tasting Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} flavors identified correctly</p>
        </div>
      </Card>
    );
  }

  const current = rounds[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Taste {currentIndex + 1} of {rounds.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground mb-2">What flavor is:</p>
        <p className="text-3xl font-bold text-foreground">{current?.ingredient}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TASTES.map(t => (
          <Button key={t.flavor} variant="outline" onClick={() => handleSelect(t.flavor)} className="h-12" data-testid={`flavor-${t.flavor.toLowerCase()}`}>
            {t.flavor}
          </Button>
        ))}
      </div>
    </Card>
  );
}
