import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Focus, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

type CompositionRound = {
  subject: string;
  correctZone: number;
  hint: string;
};

const COMPOSITIONS: CompositionRound[] = [
  { subject: "Tree", correctZone: 0, hint: "Place the tree on the left intersection" },
  { subject: "Sun", correctZone: 1, hint: "Place the sun on the right upper area" },
  { subject: "Boat", correctZone: 2, hint: "Place the boat on the left lower area" },
  { subject: "Mountain", correctZone: 3, hint: "Place the mountain on the right intersection" },
  { subject: "House", correctZone: 0, hint: "Place the house on the left focal point" },
  { subject: "Bird", correctZone: 1, hint: "Place the bird in the upper right" },
];

const SUBJECT_EMOJIS: Record<string, string> = {
  Tree: "🌳",
  Sun: "☀️",
  Boat: "⛵",
  Mountain: "⛰️",
  House: "🏠",
  Bird: "🐦",
};

export function CompositionMinigame({ onComplete }: Props) {
  const [rounds, setRounds] = useState<CompositionRound[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...COMPOSITIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setRounds(shuffled);
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && rounds.length > 0) {
      completedRef.current = true;
      const finalScore = Math.round((score / rounds.length) * 100);
      setTimeout(() => onComplete(finalScore), 1500);
    }
  }, [finished, score, rounds.length, onComplete]);

  const handleZoneClick = useCallback((zone: number) => {
    if (feedback !== null) return;
    const current = rounds[currentRound];
    const isCorrect = zone === current.correctZone;

    setFeedback(zone);
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 >= rounds.length) {
        setFinished(true);
      } else {
        setCurrentRound(prev => prev + 1);
      }
    }, 700);
  }, [rounds, currentRound, feedback]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Rule of Thirds</h2>
          <p className="text-muted-foreground">Place subjects at the correct focal points!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Focus className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Composing
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / rounds.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Composition Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {finalScore >= 70 ? (
            <Trophy className="w-10 h-10 text-yellow-500" />
          ) : finalScore >= 40 ? (
            <CheckCircle className="w-10 h-10 text-green-500" />
          ) : (
            <AlertCircle className="w-10 h-10 text-amber-500" />
          )}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">
            {finalScore}%
          </div>
          <p className="text-muted-foreground">
            {score} / {rounds.length} correct placements
          </p>
        </div>
      </Card>
    );
  }

  const current = rounds[currentRound];
  const zones = [
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
  ];

  return (
    <Card className="p-6 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Scene {currentRound + 1} of {rounds.length}
        </div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
          {timeLeft}s
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-medium">
          Place the {current?.subject} {SUBJECT_EMOJIS[current?.subject] || ""}
        </p>
        <p className="text-sm text-muted-foreground">{current?.hint}</p>
      </div>

      <div className="relative aspect-[4/3] bg-gradient-to-b from-blue-200 to-green-200 rounded-xl overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-white/30" />
          ))}
        </div>

        {zones.map((zone, i) => (
          <button
            key={i}
            onClick={() => handleZoneClick(i)}
            disabled={feedback !== null}
            className={cn(
              "absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white/80 transition-all",
              feedback === null && "hover:bg-white/30 hover:scale-110",
              feedback !== null && i === current?.correctZone && "bg-green-500/50 border-green-500",
              feedback === i && i !== current?.correctZone && "bg-red-500/50 border-red-500"
            )}
            style={{
              left: `${(zone.col / 3) * 100}%`,
              top: `${(zone.row / 3) * 100}%`,
            }}
            data-testid={`zone-${i}`}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Click on the intersection points to place the subject
      </p>
    </Card>
  );
}
