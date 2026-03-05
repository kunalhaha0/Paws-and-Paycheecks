import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Package, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const ITEMS = ["Flour", "Sugar", "Salt", "Butter", "Eggs", "Milk", "Oil", "Yeast"];

export function InventoryMinigame({ onComplete }: Props) {
  const [inventory, setInventory] = useState<{ item: string; count: number }[]>([]);
  const [questions, setQuestions] = useState<{ item: string; correctCount: number }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"count" | "answer">("count");
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [countTime, setCountTime] = useState(8);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const inv: { item: string; count: number }[] = [];
    const shuffled = [...ITEMS].sort(() => Math.random() - 0.5).slice(0, 5);
    shuffled.forEach(item => {
      const count = Math.floor(Math.random() * 5) + 1;
      inv.push({ item, count });
    });
    setInventory(inv);
    setQuestions(inv.map(i => ({ item: i.item, correctCount: i.count })).sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (!started || finished || phase !== "count") return;
    const timer = setInterval(() => {
      setCountTime(prev => { if (prev <= 1) { setPhase("answer"); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished, phase]);

  useEffect(() => {
    if (finished && !completedRef.current && questions.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / questions.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, questions.length, onComplete]);

  const handleSubmit = useCallback(() => {
    if (parseInt(input) === questions[currentIndex].correctCount) setCorrectCount(prev => prev + 1);
    setInput("");
    if (currentIndex + 1 >= questions.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [input, questions, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Kitchen Inventory</h2>
          <p className="text-muted-foreground">Count the items and remember the quantities!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Package className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Counting</Button>
      </Card>
    );
  }

  if (finished) {
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Inventory Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} counts correct</p>
        </div>
      </Card>
    );
  }

  if (phase === "count") {
    return (
      <Card className="p-8 space-y-6" data-testid="card-minigame-active">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Count in {countTime}s...</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {inventory.map((inv, i) => (
            <div key={i} className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="font-medium">{inv.item}</p>
              <div className="flex justify-center gap-1 mt-1">
                {Array.from({ length: inv.count }).map((_, j) => (
                  <div key={j} className="w-3 h-3 bg-primary rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const current = questions[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="text-sm text-muted-foreground text-center">Question {currentIndex + 1} of {questions.length}</div>
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground mb-2">How many did you count?</p>
        <p className="text-3xl font-bold text-foreground">{current?.item}</p>
      </div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value.replace(/\D/g, ""))} autoFocus className="flex-1 px-4 py-3 text-xl text-center border-2 rounded-lg focus:outline-none focus:border-primary bg-background" onKeyDown={e => e.key === "Enter" && handleSubmit()} data-testid="input-count" />
        <Button onClick={handleSubmit} size="lg" data-testid="button-submit">Submit</Button>
      </div>
    </Card>
  );
}
