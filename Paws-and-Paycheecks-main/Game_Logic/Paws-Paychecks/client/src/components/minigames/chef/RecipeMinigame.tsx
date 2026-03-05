import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BookOpen, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const RECIPES = [
  { name: "Pasta", ingredients: ["Noodles", "Tomato", "Garlic", "Basil"] },
  { name: "Salad", ingredients: ["Lettuce", "Cucumber", "Tomato", "Dressing"] },
  { name: "Soup", ingredients: ["Broth", "Carrot", "Celery", "Onion"] },
  { name: "Pizza", ingredients: ["Dough", "Cheese", "Sauce", "Pepperoni"] },
  { name: "Sandwich", ingredients: ["Bread", "Ham", "Cheese", "Lettuce"] },
];

export function RecipeMinigame({ onComplete }: Props) {
  const [recipe, setRecipe] = useState<typeof RECIPES[0] | null>(null);
  const [phase, setPhase] = useState<"memorize" | "recall">("memorize");
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [memoryTime, setMemoryTime] = useState(6);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const r = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    setRecipe(r);
    const allIngredients = [...new Set(RECIPES.flatMap(rec => rec.ingredients))];
    const extras = allIngredients.filter(i => !r.ingredients.includes(i)).sort(() => Math.random() - 0.5).slice(0, 4);
    setOptions([...r.ingredients, ...extras].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (!started || finished || phase !== "memorize") return;
    const timer = setInterval(() => {
      setMemoryTime(prev => { if (prev <= 1) { setPhase("recall"); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished, phase]);

  useEffect(() => {
    if (finished && !completedRef.current && recipe) {
      completedRef.current = true;
      const correct = selected.filter(s => recipe.ingredients.includes(s)).length;
      const wrong = selected.filter(s => !recipe.ingredients.includes(s)).length;
      const score = Math.max(0, Math.round(((correct - wrong) / recipe.ingredients.length) * 100));
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, selected, recipe, onComplete]);

  const handleSelect = useCallback((ingredient: string) => {
    if (selected.includes(ingredient)) {
      setSelected(prev => prev.filter(s => s !== ingredient));
    } else {
      setSelected(prev => [...prev, ingredient]);
    }
  }, [selected]);

  const handleSubmit = useCallback(() => setFinished(true), []);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Recipe Memory</h2>
          <p className="text-muted-foreground">Memorize the recipe ingredients!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Cooking</Button>
      </Card>
    );
  }

  if (finished && recipe) {
    const correct = selected.filter(s => recipe.ingredients.includes(s)).length;
    const wrong = selected.filter(s => !recipe.ingredients.includes(s)).length;
    const score = Math.max(0, Math.round(((correct - wrong) / recipe.ingredients.length) * 100));
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Recipe Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correct} correct, {wrong} wrong</p>
        </div>
      </Card>
    );
  }

  if (phase === "memorize" && recipe) {
    return (
      <Card className="p-8 space-y-6" data-testid="card-minigame-active">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Memorize in {memoryTime}s...</p>
          <h3 className="text-2xl font-bold text-foreground">{recipe.name}</h3>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="px-4 py-2 bg-primary/10 rounded-lg font-medium text-primary">{ing}</div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="text-center">
        <p className="text-muted-foreground">Select ingredients for: <span className="font-bold text-foreground">{recipe?.name}</span></p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {options.map((opt, i) => (
          <button key={i} onClick={() => handleSelect(opt)} className={cn("px-4 py-2 rounded-lg border transition-all", selected.includes(opt) ? "bg-primary text-primary-foreground" : "bg-card hover-elevate")} data-testid={`ingredient-${i}`}>
            {opt}
          </button>
        ))}
      </div>
      <Button onClick={handleSubmit} size="lg" className="w-full" data-testid="button-submit">Done ({selected.length} selected)</Button>
    </Card>
  );
}
