import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Utensils, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const POSITIONS = ["top-left", "top-right", "center", "bottom-left", "bottom-right"];
const ITEMS = ["Main", "Side", "Garnish", "Sauce", "Bread"];

export function PlatingMinigame({ onComplete }: Props) {
  const [targetOrder, setTargetOrder] = useState<string[]>([]);
  const [playerOrder, setPlayerOrder] = useState<(string | null)[]>([null, null, null, null, null]);
  const [availableItems, setAvailableItems] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<"memorize" | "place">("memorize");
  const [memoryTime, setMemoryTime] = useState(5);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffledItems = [...ITEMS].sort(() => Math.random() - 0.5);
    setTargetOrder(shuffledItems);
    setAvailableItems([...shuffledItems].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (!started || finished || phase !== "memorize") return;
    const timer = setInterval(() => {
      setMemoryTime(prev => { if (prev <= 1) { setPhase("place"); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished, phase]);

  useEffect(() => {
    if (phase === "place" && !playerOrder.includes(null) && started) {
      setFinished(true);
    }
  }, [playerOrder, phase, started]);

  useEffect(() => {
    if (finished && !completedRef.current) {
      completedRef.current = true;
      let correct = 0;
      playerOrder.forEach((item, i) => { if (item === targetOrder[i]) correct++; });
      const score = Math.round((correct / 5) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, playerOrder, targetOrder, onComplete]);

  const handleItemClick = useCallback((item: string) => setSelected(item), []);

  const handlePositionClick = useCallback((index: number) => {
    if (!selected || playerOrder[index]) return;
    const newOrder = [...playerOrder];
    newOrder[index] = selected;
    setPlayerOrder(newOrder);
    setAvailableItems(prev => prev.filter(i => i !== selected));
    setSelected(null);
  }, [selected, playerOrder]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Food Plating</h2>
          <p className="text-muted-foreground">Memorize and recreate the plate arrangement!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Utensils className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Plating</Button>
      </Card>
    );
  }

  if (finished) {
    let correct = 0;
    playerOrder.forEach((item, i) => { if (item === targetOrder[i]) correct++; });
    const score = Math.round((correct / 5) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Plating Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correct} items placed correctly</p>
        </div>
      </Card>
    );
  }

  if (phase === "memorize") {
    return (
      <Card className="p-8 space-y-6" data-testid="card-minigame-active">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Memorize in {memoryTime}s...</p>
        </div>
        <div className="grid grid-cols-3 gap-2 aspect-square max-w-xs mx-auto">
          <div className="p-2 bg-primary/20 rounded flex items-center justify-center text-sm font-medium">{targetOrder[0]}</div>
          <div></div>
          <div className="p-2 bg-primary/20 rounded flex items-center justify-center text-sm font-medium">{targetOrder[1]}</div>
          <div></div>
          <div className="p-2 bg-primary/20 rounded flex items-center justify-center text-sm font-medium">{targetOrder[2]}</div>
          <div></div>
          <div className="p-2 bg-primary/20 rounded flex items-center justify-center text-sm font-medium">{targetOrder[3]}</div>
          <div></div>
          <div className="p-2 bg-primary/20 rounded flex items-center justify-center text-sm font-medium">{targetOrder[4]}</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4" data-testid="card-minigame-active">
      <p className="text-center text-muted-foreground">Recreate the plate!</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {availableItems.map(item => (
          <button key={item} onClick={() => handleItemClick(item)} className={cn("px-3 py-2 rounded-lg bg-card border", selected === item && "ring-2 ring-primary")} data-testid={`item-${item}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 aspect-square max-w-xs mx-auto">
        {[0, -1, 1, -1, 2, -1, 3, -1, 4].map((pos, i) => 
          pos === -1 ? <div key={i}></div> : (
            <button key={i} onClick={() => handlePositionClick(pos)} disabled={!!playerOrder[pos]} className={cn("p-2 border-2 border-dashed rounded flex items-center justify-center text-sm", playerOrder[pos] ? "bg-primary/20 border-primary" : "hover:border-primary")} data-testid={`position-${pos}`}>
              {playerOrder[pos] || POSITIONS[pos]}
            </button>
          )
        )}
      </div>
    </Card>
  );
}
