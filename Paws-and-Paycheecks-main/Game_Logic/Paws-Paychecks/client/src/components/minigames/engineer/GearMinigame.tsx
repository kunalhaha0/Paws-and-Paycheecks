import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Cog, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

export function GearMinigame({ onComplete }: Props) {
  const [gears, setGears] = useState<{ size: "small" | "medium" | "large"; placed: boolean }[]>([]);
  const [slots, setSlots] = useState<("small" | "medium" | "large" | null)[]>([null, null, null]);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [round, setRound] = useState(0);
  const completedRef = useRef(false);
  const targetOrder: ("small" | "medium" | "large")[] = ["large", "medium", "small"];

  useEffect(() => {
    const sizes: ("small" | "medium" | "large")[] = ["small", "medium", "large"];
    setGears(sizes.sort(() => Math.random() - 0.5).map(s => ({ size: s, placed: false })));
    setSlots([null, null, null]);
  }, [round]);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (started && !slots.includes(null) && gears.every(g => g.placed)) {
      const isCorrect = slots.every((s, i) => s === targetOrder[i]);
      if (isCorrect) setCorrectCount(prev => prev + 1);
      if (round < 2) {
        setTimeout(() => setRound(r => r + 1), 500);
      } else {
        setTimeout(() => setFinished(true), 500);
      }
    }
  }, [slots, gears, started, round]);

  useEffect(() => {
    if (finished && !completedRef.current) {
      completedRef.current = true;
      const score = Math.round((correctCount / 3) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, onComplete]);

  const handleGearClick = useCallback((index: number) => {
    if (gears[index].placed) return;
    setSelected(index);
  }, [gears]);

  const handleSlotClick = useCallback((slotIndex: number) => {
    if (selected === null || slots[slotIndex] !== null) return;
    const gear = gears[selected];
    const newSlots = [...slots];
    newSlots[slotIndex] = gear.size;
    setSlots(newSlots);
    setGears(prev => prev.map((g, i) => i === selected ? { ...g, placed: true } : g));
    setSelected(null);
  }, [selected, gears, slots]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Gear Assembly</h2>
          <p className="text-muted-foreground">Place gears in order: Large, Medium, Small!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Cog className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Assembly</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / 3) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Assembly Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} / 3 assemblies correct</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Round {round + 1} of 3</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <p className="text-center text-muted-foreground">Order: Large - Medium - Small</p>
      <div className="flex justify-center gap-4">
        {gears.map((gear, i) => (
          <button key={i} onClick={() => handleGearClick(i)} disabled={gear.placed} className={cn("rounded-full flex items-center justify-center transition-all border-2", gear.size === "small" && "w-12 h-12", gear.size === "medium" && "w-16 h-16", gear.size === "large" && "w-20 h-20", gear.placed ? "opacity-30" : "hover-elevate", selected === i && "ring-2 ring-primary")} data-testid={`gear-${i}`}>
            <Cog className={cn(gear.size === "small" && "w-8 h-8", gear.size === "medium" && "w-12 h-12", gear.size === "large" && "w-16 h-16", "text-muted-foreground")} />
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        {slots.map((slot, i) => (
          <button key={i} onClick={() => handleSlotClick(i)} disabled={slot !== null} className={cn("w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center", slot ? "bg-primary/10 border-primary" : "hover:border-primary")} data-testid={`slot-${i}`}>
            {slot ? <Cog className={cn(slot === "small" && "w-8 h-8", slot === "medium" && "w-12 h-12", slot === "large" && "w-16 h-16", "text-primary")} /> : <span className="text-xs text-muted-foreground">Slot {i + 1}</span>}
          </button>
        ))}
      </div>
    </Card>
  );
}
