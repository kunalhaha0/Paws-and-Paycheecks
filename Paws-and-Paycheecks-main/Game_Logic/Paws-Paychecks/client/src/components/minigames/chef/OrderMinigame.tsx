import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UtensilsCrossed, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const DISHES = ["Burger", "Pizza", "Pasta", "Salad", "Soup", "Sandwich", "Tacos", "Sushi"];

export function OrderMinigame({ onComplete }: Props) {
  const [orders, setOrders] = useState<string[]>([]);
  const [currentOrder, setCurrentOrder] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...DISHES].sort(() => Math.random() - 0.5);
    setOrders(shuffled);
    setTotalOrders(shuffled.length);
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setCurrentOrder(orders[0]);
      const others = DISHES.filter(d => d !== orders[0]).sort(() => Math.random() - 0.5).slice(0, 3);
      setOptions([orders[0], ...others].sort(() => Math.random() - 0.5));
    }
  }, [orders]);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && totalOrders > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / totalOrders) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, totalOrders, onComplete]);

  const handleSelect = useCallback((dish: string) => {
    if (dish === currentOrder) setCorrectCount(prev => prev + 1);
    const remaining = orders.slice(1);
    if (remaining.length === 0) setFinished(true);
    else setOrders(remaining);
  }, [currentOrder, orders]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Order Rush</h2>
          <p className="text-muted-foreground">Match the customer's order quickly!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <UtensilsCrossed className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Orders</Button>
      </Card>
    );
  }

  if (finished) {
    const score = totalOrders > 0 ? Math.round((correctCount / totalOrders) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Kitchen Closed!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} orders filled correctly</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{orders.length} orders left</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center p-6 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
        <p className="text-muted-foreground mb-2">Customer wants:</p>
        <p className="text-3xl font-bold text-foreground">{currentOrder}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <Button key={i} variant="outline" onClick={() => handleSelect(opt)} className="h-14 text-lg" data-testid={`dish-${i}`}>
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
}
