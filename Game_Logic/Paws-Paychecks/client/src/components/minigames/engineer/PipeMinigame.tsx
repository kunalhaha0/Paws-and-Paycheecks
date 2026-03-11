import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Workflow, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type Pipe = "straight" | "corner" | "t-junction";
const PIPE_TYPES: Pipe[] = ["straight", "corner", "t-junction", "straight", "corner"];

export function PipeMinigame({ onComplete }: Props) {
  const [targetPipes, setTargetPipes] = useState<Pipe[]>([]);
  const [playerPipes, setPlayerPipes] = useState<(Pipe | null)[]>([null, null, null, null, null]);
  const [phase, setPhase] = useState<"memorize" | "build">("memorize");
  const [memoryTime, setMemoryTime] = useState(5);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setTargetPipes([...PIPE_TYPES].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (!started || finished || phase !== "memorize") return;
    const timer = setInterval(() => {
      setMemoryTime(prev => { if (prev <= 1) { setPhase("build"); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished, phase]);

  useEffect(() => {
    if (phase === "build" && !playerPipes.includes(null) && started) setFinished(true);
  }, [playerPipes, phase, started]);

  useEffect(() => {
    if (finished && !completedRef.current && targetPipes.length > 0) {
      completedRef.current = true;
      let correct = 0;
      playerPipes.forEach((p, i) => { if (p === targetPipes[i]) correct++; });
      const score = Math.round((correct / targetPipes.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, playerPipes, targetPipes, onComplete]);

  const handlePlacePipe = useCallback((index: number, pipe: Pipe) => {
    if (playerPipes[index] !== null) return;
    const newPipes = [...playerPipes];
    newPipes[index] = pipe;
    setPlayerPipes(newPipes);
  }, [playerPipes]);

  const getPipeSymbol = (pipe: Pipe) => {
    switch (pipe) {
      case "straight": return "━";
      case "corner": return "┓";
      case "t-junction": return "┳";
    }
  };

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Pipe Fitting</h2>
          <p className="text-muted-foreground">Memorize and recreate the pipe layout!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Workflow className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Fitting</Button>
      </Card>
    );
  }

  if (finished) {
    let correct = 0;
    playerPipes.forEach((p, i) => { if (p === targetPipes[i]) correct++; });
    const score = Math.round((correct / targetPipes.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Pipes Connected!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correct} / {targetPipes.length} pipes correct</p>
        </div>
      </Card>
    );
  }

  if (phase === "memorize") {
    return (
      <Card className="p-8 space-y-6" data-testid="card-minigame-active">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Memorize in {memoryTime}s...</p>
        </div>
        <div className="flex justify-center gap-2">
          {targetPipes.map((pipe, i) => (
            <div key={i} className="w-14 h-14 bg-gray-700 rounded flex items-center justify-center text-3xl text-green-400 font-mono">
              {getPipeSymbol(pipe)}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <span className="mr-4">━ = straight</span>
          <span className="mr-4">┓ = corner</span>
          <span>┳ = t-junction</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4" data-testid="card-minigame-active">
      <p className="text-center text-muted-foreground">Recreate the pipe layout!</p>
      <div className="flex justify-center gap-2">
        {playerPipes.map((pipe, i) => (
          <div key={i} className={cn("w-14 h-14 bg-gray-700 rounded flex items-center justify-center text-3xl font-mono", pipe ? "text-green-400" : "text-gray-500")}>
            {pipe ? getPipeSymbol(pipe) : "?"}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        {(["straight", "corner", "t-junction"] as Pipe[]).map(pipe => (
          <Button key={pipe} variant="outline" onClick={() => {
            const emptyIndex = playerPipes.findIndex(p => p === null);
            if (emptyIndex !== -1) handlePlacePipe(emptyIndex, pipe);
          }} className="h-14 w-20 text-2xl font-mono" data-testid={`pipe-${pipe}`}>
            {getPipeSymbol(pipe)}
          </Button>
        ))}
      </div>
    </Card>
  );
}
