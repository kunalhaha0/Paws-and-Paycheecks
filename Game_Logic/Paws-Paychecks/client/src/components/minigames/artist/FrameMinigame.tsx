import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Frame, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

type FrameMatch = {
  artwork: string;
  artStyle: string;
  correctFrame: string;
  options: string[];
};

const FRAME_MATCHES: FrameMatch[] = [
  {
    artwork: "Renaissance Portrait",
    artStyle: "Classical oil painting",
    correctFrame: "Ornate Gold",
    options: ["Ornate Gold", "Modern Black", "Rustic Wood", "Minimalist White"],
  },
  {
    artwork: "Abstract Expressionism",
    artStyle: "Bold splashes of color",
    correctFrame: "Modern Black",
    options: ["Ornate Gold", "Modern Black", "Baroque Silver", "Rustic Wood"],
  },
  {
    artwork: "Country Landscape",
    artStyle: "Pastoral farm scene",
    correctFrame: "Rustic Wood",
    options: ["Minimalist White", "Ornate Gold", "Rustic Wood", "Modern Black"],
  },
  {
    artwork: "Minimalist Art",
    artStyle: "Simple geometric shapes",
    correctFrame: "Minimalist White",
    options: ["Minimalist White", "Baroque Silver", "Rustic Wood", "Ornate Gold"],
  },
  {
    artwork: "Victorian Portrait",
    artStyle: "Elegant period piece",
    correctFrame: "Baroque Silver",
    options: ["Modern Black", "Baroque Silver", "Minimalist White", "Rustic Wood"],
  },
];

const FRAME_STYLES: Record<string, string> = {
  "Ornate Gold": "border-yellow-600 bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700",
  "Modern Black": "border-gray-900 bg-gray-800",
  "Rustic Wood": "border-amber-800 bg-gradient-to-b from-amber-700 to-amber-900",
  "Minimalist White": "border-gray-200 bg-white",
  "Baroque Silver": "border-gray-400 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400",
};

export function FrameMinigame({ onComplete }: Props) {
  const [rounds, setRounds] = useState<FrameMatch[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...FRAME_MATCHES].sort(() => Math.random() - 0.5);
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

  const handleFrameSelect = useCallback((frame: string) => {
    if (feedback) return;
    const current = rounds[currentRound];
    const isCorrect = frame === current.correctFrame;

    setFeedback(frame);
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
          <h2 className="text-2xl font-bold text-foreground">Frame Matcher</h2>
          <p className="text-muted-foreground">Match artwork to the perfect frame style!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Frame className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Framing
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / rounds.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Gallery Ready!</h2>
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
            {score} / {rounds.length} frames matched
          </p>
        </div>
      </Card>
    );
  }

  const current = rounds[currentRound];

  return (
    <Card className="p-6 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Artwork {currentRound + 1} of {rounds.length}
        </div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
          {timeLeft}s
        </div>
      </div>

      <div className="text-center p-6 bg-muted/30 rounded-xl space-y-2">
        <h3 className="text-xl font-bold">{current?.artwork}</h3>
        <p className="text-muted-foreground">{current?.artStyle}</p>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Choose the best frame for this artwork:
      </p>

      <div className="grid grid-cols-2 gap-4">
        {current?.options.map((frame, i) => (
          <button
            key={frame}
            onClick={() => handleFrameSelect(frame)}
            disabled={!!feedback}
            className={cn(
              "p-4 rounded-lg border-4 transition-all flex flex-col items-center gap-2",
              FRAME_STYLES[frame],
              feedback && frame === current.correctFrame && "ring-4 ring-green-500",
              feedback === frame && frame !== current.correctFrame && "ring-4 ring-red-500",
              !feedback && "hover:scale-105"
            )}
            data-testid={`frame-option-${i}`}
          >
            <div className="w-12 h-8 bg-muted rounded" />
            <span className="text-xs font-medium text-center">{frame}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
