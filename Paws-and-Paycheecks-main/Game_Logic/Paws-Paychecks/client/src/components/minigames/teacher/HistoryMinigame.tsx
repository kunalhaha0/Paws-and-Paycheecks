import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Landmark, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type HistoryEvent = { event: string; year: string; wrongYears: string[]; };

const EVENTS: HistoryEvent[] = [
  { event: "Declaration of Independence signed", year: "1776", wrongYears: ["1789", "1812", "1754"] },
  { event: "World War I began", year: "1914", wrongYears: ["1918", "1939", "1901"] },
  { event: "World War II ended", year: "1945", wrongYears: ["1941", "1939", "1950"] },
  { event: "Moon landing (Apollo 11)", year: "1969", wrongYears: ["1965", "1972", "1961"] },
  { event: "Fall of the Berlin Wall", year: "1989", wrongYears: ["1991", "1985", "1979"] },
  { event: "Columbus reached America", year: "1492", wrongYears: ["1500", "1488", "1502"] },
  { event: "French Revolution began", year: "1789", wrongYears: ["1776", "1799", "1815"] },
  { event: "Civil Rights Act passed", year: "1964", wrongYears: ["1955", "1968", "1972"] },
  { event: "Great Fire of London", year: "1666", wrongYears: ["1688", "1650", "1700"] },
  { event: "First airplane flight", year: "1903", wrongYears: ["1910", "1895", "1920"] },
];

type Question = { event: string; options: string[]; correct: number; };

const generateQuestions = (): Question[] => {
  const shuffled = [...EVENTS].sort(() => Math.random() - 0.5).slice(0, 8);
  return shuffled.map(item => {
    const options = [item.year, ...item.wrongYears].sort(() => Math.random() - 0.5);
    return { event: item.event, options, correct: options.indexOf(item.year) };
  });
};

export function HistoryMinigame({ onComplete }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [correctCount, setCorrectCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    setQuestions(generateQuestions());
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { setFinished(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    if (finished && !completedRef.current && questions.length > 0) {
      completedRef.current = true;
      const score = Math.round((correctCount / questions.length) * 100);
      setTimeout(() => onComplete(score), 1500);
    }
  }, [finished, correctCount, questions.length, onComplete]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (optionIndex === questions[currentIndex].correct) {
      setCorrectCount(prev => prev + 1);
    }
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [questions, currentIndex]);

  if (!started) {
    return (
      <Card className="p-8 text-center space-y-6" data-testid="card-minigame-intro">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">History Timeline</h2>
          <p className="text-muted-foreground">Match historical events to their dates!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Landmark className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start History</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">History Complete!</h2>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          {score >= 70 ? <Trophy className="w-10 h-10 text-yellow-500" /> : score >= 40 ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertCircle className="w-10 h-10 text-amber-500" />}
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold text-primary" data-testid="text-minigame-score">{score}%</div>
          <p className="text-muted-foreground">{correctCount} / {questions.length} matched correctly</p>
        </div>
      </Card>
    );
  }

  const current = questions[currentIndex];

  return (
    <Card className="p-8 space-y-6" data-testid="card-minigame-active">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">Event {currentIndex + 1} of {questions.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center space-y-6">
        <div className="p-6 bg-muted/50 rounded-lg">
          <p className="text-xl font-medium text-foreground" data-testid="text-event">{current?.event}</p>
        </div>
        <p className="text-muted-foreground">When did this happen?</p>
        <div className="grid grid-cols-2 gap-3">
          {current?.options.map((option, i) => (
            <Button key={i} onClick={() => handleAnswer(i)} variant="outline" size="lg" className="text-xl font-mono" data-testid={`button-option-${i}`}>
              {option}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
