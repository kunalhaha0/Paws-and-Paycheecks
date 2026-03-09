import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Layers, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type Flashcard = { term: string; definition: string; options: string[]; correct: number; };

const VOCABULARY: { term: string; definition: string; }[] = [
  { term: "Photosynthesis", definition: "Process plants use to convert sunlight to energy" },
  { term: "Democracy", definition: "Government by the people" },
  { term: "Metamorphosis", definition: "Transformation from one form to another" },
  { term: "Hypothesis", definition: "An educated guess or prediction" },
  { term: "Ecosystem", definition: "Community of living things interacting together" },
  { term: "Gravity", definition: "Force that attracts objects toward each other" },
  { term: "Metaphor", definition: "Comparing two things without using like or as" },
  { term: "Chromosome", definition: "Structure containing genetic information" },
  { term: "Revolution", definition: "A complete change or overthrow" },
  { term: "Fraction", definition: "Part of a whole number" },
];

const generateFlashcards = (): Flashcard[] => {
  const shuffled = [...VOCABULARY].sort(() => Math.random() - 0.5).slice(0, 8);
  return shuffled.map(item => {
    const wrongAnswers = VOCABULARY.filter(v => v.term !== item.term).sort(() => Math.random() - 0.5).slice(0, 2).map(v => v.definition);
    const options = [...wrongAnswers, item.definition].sort(() => Math.random() - 0.5);
    return { term: item.term, definition: item.definition, options, correct: options.indexOf(item.definition) };
  });
};

export function FlashcardMinigame({ onComplete }: Props) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setCards(generateFlashcards());
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && cards.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / cards.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, cards.length, onComplete]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (optionIndex === cards[currentIndex].correct) {
      setCorrectCount(prev => prev + 1);
    }
    if (currentIndex + 1 >= cards.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [cards, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Flashcard Match</h2>
          <p className="text-muted-foreground">Match vocabulary terms to their definitions!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Layers className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Matching</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / cards.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Study Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} / {cards.length} matched correctly</p>
        </div>
      </Card>
    );
  }

  const current = cards[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Card {currentIndex + 1} of {cards.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center space-y-6">
        <div className="p-6 bg-primary/10 rounded-lg">
          <p className="text-2xl font-bold text-foreground" data-testid="text-term">{current?.term}</p>
        </div>
        <p className="text-muted-foreground">Select the correct definition:</p>
        <div className="flex flex-col gap-3">
          {current?.options.map((option, i) => (
            <Button key={i} onClick={() => handleAnswer(i)} variant="outline" className="text-left h-auto py-3 px-4 whitespace-normal" data-testid={`button-option-${i}`}>
              {option}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
