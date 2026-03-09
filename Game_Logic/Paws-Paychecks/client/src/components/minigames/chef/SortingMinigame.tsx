import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChefHat, Carrot, Drumstick, Milk, Wheat, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type Ingredient = { id: string; name: string; category: "vegetable" | "protein" | "dairy" | "grain"; };

const INGREDIENTS: Ingredient[] = [
  { id: "1", name: "Tomato", category: "vegetable" },
  { id: "2", name: "Carrot", category: "vegetable" },
  { id: "3", name: "Broccoli", category: "vegetable" },
  { id: "4", name: "Chicken", category: "protein" },
  { id: "5", name: "Fish", category: "protein" },
  { id: "6", name: "Egg", category: "protein" },
  { id: "7", name: "Cheese", category: "dairy" },
  { id: "8", name: "Milk", category: "dairy" },
  { id: "9", name: "Bread", category: "grain" },
  { id: "10", name: "Rice", category: "grain" },
];

const CATEGORIES = [
  { id: "vegetable", name: "Vegetables", icon: Carrot },
  { id: "protein", name: "Proteins", icon: Drumstick },
  { id: "dairy", name: "Dairy", icon: Milk },
  { id: "grain", name: "Grains", icon: Wheat },
];

export function SortingMinigame({ onComplete }: Props) {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [sorted, setSorted] = useState<Record<string, Ingredient[]>>({ vegetable: [], protein: [], dairy: [], grain: [] });
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...INGREDIENTS].sort(() => Math.random() - 0.5).slice(0, 8);
    setItems(shuffled);
    setTotalItems(shuffled.length);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (started && items.length === 0 && totalItems > 0) setFinished(true);
  }, [items.length, started, totalItems]);

  useEffect(() => {
    if (finished && !completedRef.current && totalItems > 0) {
      completedRef.current = true;
      let correct = 0;
      Object.entries(sorted).forEach(([category, sortedItems]) => {
        sortedItems.forEach(item => { if (item.category === category) correct++; });
      });
      setCorrectCount(correct);
      const score = Math.round((correct / totalItems) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, sorted, totalItems, onComplete]);

  const handleItemClick = useCallback((item: Ingredient) => setSelected(item), []);

  const handleCategoryClick = useCallback((category: string) => {
    if (!selected) return;
    setSorted(prev => ({ ...prev, [category]: [...prev[category], selected] }));
    setItems(prev => prev.filter(i => i.id !== selected.id));
    setSelected(null);
  }, [selected]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Ingredient Sorting</h2>
          <p className="text-muted-foreground">Sort ingredients into the correct categories!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <ChefHat className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Sorting</Button>
      </Card>
    );
  }

  if (finished) {
    const score = totalItems > 0 ? Math.round((correctCount / totalItems) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Kitchen Closed!</h2>
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

  return (
    <Card className="p-6 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{items.length} items left</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center min-h-[80px] p-4 bg-muted/50 rounded-lg">
        {items.map(item => (
          <button key={item.id} onClick={() => handleItemClick(item)} className={cn("px-4 py-2 rounded-lg bg-card border shadow-sm hover-elevate", selected?.id === item.id && "ring-2 ring-primary scale-105")} data-testid={`ingredient-${item.id}`}>
            {item.name}
          </button>
        ))}
      </div>
      {selected && <p className="text-center text-sm text-muted-foreground">Click a category to sort: <span className="font-medium">{selected.name}</span></p>}
      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map(cat => {
          const IconComponent = cat.icon;
          return (
            <button key={cat.id} onClick={() => handleCategoryClick(cat.id)} disabled={!selected} className={cn("p-4 rounded-lg border-2 border-dashed flex flex-col items-center gap-2", selected ? "hover:border-primary hover:bg-primary/5" : "opacity-70")} data-testid={`category-${cat.id}`}>
              <IconComponent className="w-6 h-6 text-muted-foreground" />
              <span className="font-medium">{cat.name}</span>
              {sorted[cat.id].length > 0 && <span className="text-sm text-muted-foreground">{sorted[cat.id].length} items</span>}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
