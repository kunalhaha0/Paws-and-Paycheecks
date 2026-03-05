import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Pipette, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onComplete: (score: number) => void;
}

type ColorPair = {
  primary: string;
  primaryName: string;
  complement: string;
  complementName: string;
  options: { hex: string; name: string }[];
};

const COLOR_PAIRS: ColorPair[] = [
  {
    primary: "#FF0000",
    primaryName: "Red",
    complement: "#00FFFF",
    complementName: "Cyan",
    options: [
      { hex: "#00FFFF", name: "Cyan" },
      { hex: "#00FF00", name: "Green" },
      { hex: "#FFFF00", name: "Yellow" },
      { hex: "#FF00FF", name: "Magenta" },
    ],
  },
  {
    primary: "#0000FF",
    primaryName: "Blue",
    complement: "#FFA500",
    complementName: "Orange",
    options: [
      { hex: "#FFA500", name: "Orange" },
      { hex: "#FF0000", name: "Red" },
      { hex: "#00FF00", name: "Green" },
      { hex: "#FFFF00", name: "Yellow" },
    ],
  },
  {
    primary: "#FFFF00",
    primaryName: "Yellow",
    complement: "#800080",
    complementName: "Purple",
    options: [
      { hex: "#800080", name: "Purple" },
      { hex: "#0000FF", name: "Blue" },
      { hex: "#FF0000", name: "Red" },
      { hex: "#00FF00", name: "Green" },
    ],
  },
  {
    primary: "#00FF00",
    primaryName: "Green",
    complement: "#FF00FF",
    complementName: "Magenta",
    options: [
      { hex: "#FF00FF", name: "Magenta" },
      { hex: "#0000FF", name: "Blue" },
      { hex: "#FFA500", name: "Orange" },
      { hex: "#00FFFF", name: "Cyan" },
    ],
  },
  {
    primary: "#FFA500",
    primaryName: "Orange",
    complement: "#0000FF",
    complementName: "Blue",
    options: [
      { hex: "#0000FF", name: "Blue" },
      { hex: "#FF0000", name: "Red" },
      { hex: "#00FF00", name: "Green" },
      { hex: "#800080", name: "Purple" },
    ],
  },
];

export function PaletteMinigame({ onComplete }: Props) {
  const [rounds, setRounds] = useState<ColorPair[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const shuffled = [...COLOR_PAIRS].sort(() => Math.random() - 0.5);
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

  const handleColorSelect = useCallback((hex: string) => {
    if (feedback) return;
    const current = rounds[currentRound];
    const isCorrect = hex === current.complement;

    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      if (currentRound + 1 >= rounds.length) {
        setFinished(true);
      } else {
        setCurrentRound(prev => prev + 1);
      }
    }, 600);
  }, [rounds, currentRound, feedback]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Complementary Colors</h2>
          <p className="text-muted-foreground">Find the complementary color for each hue!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Pipette className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">
          Start Palette
        </Button>
      </Card>
    );
  }

  if (finished) {
    const finalScore = Math.round((score / rounds.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Color Theory Complete!</h2>
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
            {score} / {rounds.length} complements found
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
          Round {currentRound + 1} of {rounds.length}
        </div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive" : "text-foreground")}>
          {timeLeft}s
        </div>
      </div>

      <div className="text-center space-y-4">
        <p className="text-lg">Find the complementary color for:</p>
        <div className="flex items-center justify-center gap-4">
          <div
            className="w-20 h-20 rounded-xl shadow-lg"
            style={{ backgroundColor: current?.primary }}
          />
          <span className="font-bold text-xl">{current?.primaryName}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {current?.options.sort(() => Math.random() - 0.5).map((option, i) => (
          <button
            key={option.hex}
            onClick={() => handleColorSelect(option.hex)}
            disabled={!!feedback}
            className={cn(
              "p-4 rounded-xl shadow-md flex flex-col items-center gap-2 border-2 border-transparent transition-all",
              feedback && option.hex === current.complement && "ring-4 ring-green-500",
              feedback === "wrong" && option.hex !== current.complement && "opacity-50"
            )}
            data-testid={`palette-option-${i}`}
          >
            <div
              className="w-16 h-16 rounded-lg"
              style={{ backgroundColor: option.hex }}
            />
            <span className="font-medium text-sm">{option.name}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
