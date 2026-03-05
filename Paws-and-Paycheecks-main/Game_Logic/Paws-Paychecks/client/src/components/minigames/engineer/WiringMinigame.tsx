import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Cable, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const COLORS = ["Red", "Blue", "Green", "Yellow", "Black", "White"];

export function WiringMinigame({ onComplete }: Props) {
  const [wires, setWires] = useState<{ color: string; connected: boolean }[]>([]);
  const [selectedWire, setSelectedWire] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const [rightSide, setRightSide] = useState<string[]>([]);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 5);
    setWires(shuffled.map(c => ({ color: c, connected: false })));
    setRightSide([...shuffled].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (started && wires.length > 0 && wires.every(w => w.connected)) setFinished(true);
  }, [wires, started]);

  useEffect(() => {
    if (finished && !completedRef.current && wires.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / wires.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, wires.length, onComplete]);

  const handleLeftClick = useCallback((index: number) => {
    if (wires[index].connected) return;
    setSelectedWire(index);
  }, [wires]);

  const handleRightClick = useCallback((color: string) => {
    if (selectedWire === null) return;
    const wire = wires[selectedWire];
    if (wire.color === color) setCorrectCount(prev => prev + 1);
    setWires(prev => prev.map((w, i) => i === selectedWire ? { ...w, connected: true } : w));
    setSelectedWire(null);
  }, [selectedWire, wires]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Wire Colors</h2>
          <p className="text-muted-foreground">Match each wire to its color on the right!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Cable className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Wiring</Button>
      </Card>
    );
  }

  if (finished) {
    const score = wires.length > 0 ? Math.round((correctCount / wires.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Wiring Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} wires connected correctly</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{wires.filter(w => !w.connected).length} wires left</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="flex justify-between gap-4">
        <div className="space-y-2 flex-1">
          {wires.map((wire, i) => (
            <button key={i} onClick={() => handleLeftClick(i)} disabled={wire.connected} className={cn("w-full p-3 rounded-lg border-2 text-left transition-all", wire.connected ? "opacity-50 bg-muted" : "hover-elevate", selectedWire === i && "ring-2 ring-primary")} data-testid={`wire-left-${i}`}>
              <div className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded-full", wire.color === "Red" && "bg-red-500", wire.color === "Blue" && "bg-blue-500", wire.color === "Green" && "bg-green-500", wire.color === "Yellow" && "bg-yellow-500", wire.color === "Black" && "bg-gray-800", wire.color === "White" && "bg-gray-200 border")} />
                <span>{wire.connected ? "Connected" : "Wire " + (i + 1)}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="space-y-2 flex-1">
          {rightSide.map((color, i) => (
            <button key={i} onClick={() => handleRightClick(color)} disabled={selectedWire === null} className={cn("w-full p-3 rounded-lg border-2 text-right transition-all", selectedWire !== null && "hover-elevate")} data-testid={`wire-right-${i}`}>
              <div className="flex items-center justify-end gap-2">
                <span>{color}</span>
                <div className={cn("w-4 h-4 rounded-full", color === "Red" && "bg-red-500", color === "Blue" && "bg-blue-500", color === "Green" && "bg-green-500", color === "Yellow" && "bg-yellow-500", color === "Black" && "bg-gray-800", color === "White" && "bg-gray-200 border")} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
