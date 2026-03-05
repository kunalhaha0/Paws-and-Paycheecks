import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

const BLUEPRINTS = [
  { shape: "Square", sides: 4, corners: 4 },
  { shape: "Triangle", sides: 3, corners: 3 },
  { shape: "Pentagon", sides: 5, corners: 5 },
  { shape: "Hexagon", sides: 6, corners: 6 },
  { shape: "Octagon", sides: 8, corners: 8 },
];

export function BlueprintMinigame({ onComplete }: Props) {
  const [blueprints, setBlueprints] = useState<typeof BLUEPRINTS>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(35);
  const [questionType, setQuestionType] = useState<"sides" | "corners">("sides");
  const completedRef = useRef(false);

  useEffect(() => {
    setBlueprints([...BLUEPRINTS].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (blueprints.length > 0) setQuestionType(Math.random() > 0.5 ? "sides" : "corners");
  }, [currentIndex, blueprints]);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && blueprints.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / blueprints.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, blueprints.length, onComplete]);

  const handleSelect = useCallback((num: number) => {
    const current = blueprints[currentIndex];
    const correct = questionType === "sides" ? current.sides : current.corners;
    if (num === correct) setCorrectCount(prev => prev + 1);
    if (currentIndex + 1 >= blueprints.length) setFinished(true);
    else setCurrentIndex(prev => prev + 1);
  }, [blueprints, currentIndex, questionType]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Blueprint Reading</h2>
          <p className="text-muted-foreground">Count the sides or corners of each shape!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Reading</Button>
      </Card>
    );
  }

  if (finished) {
    const score = blueprints.length > 0 ? Math.round((correctCount / blueprints.length) * 100) : 0;
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Blueprint Done!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} blueprints read correctly</p>
        </div>
      </Card>
    );
  }

  const current = blueprints[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Blueprint {currentIndex + 1} of {blueprints.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
        <p className="text-3xl font-bold text-foreground mb-2">{current?.shape}</p>
        <p className="text-muted-foreground">How many {questionType}?</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[3, 4, 5, 6, 7, 8].map(num => (
          <Button key={num} variant="outline" onClick={() => handleSelect(num)} className="h-14 text-xl" data-testid={`num-${num}`}>
            {num}
          </Button>
        ))}
      </div>
    </Card>
  );
}
