import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Globe, Trophy, CheckCircle, AlertCircle } from "lucide-react";

interface Props { onComplete: (score: number) => void; }

type CountryCapital = { country: string; capital: string; };

const COUNTRIES: CountryCapital[] = [
  { country: "France", capital: "Paris" },
  { country: "Japan", capital: "Tokyo" },
  { country: "Australia", capital: "Canberra" },
  { country: "Brazil", capital: "Brasilia" },
  { country: "Canada", capital: "Ottawa" },
  { country: "Germany", capital: "Berlin" },
  { country: "Italy", capital: "Rome" },
  { country: "Spain", capital: "Madrid" },
  { country: "Egypt", capital: "Cairo" },
  { country: "India", capital: "New Delhi" },
  { country: "China", capital: "Beijing" },
  { country: "Mexico", capital: "Mexico City" },
];

type Question = { country: string; options: string[]; correct: number; };

const generateQuestions = (): Question[] => {
  const shuffled = [...COUNTRIES].sort(() => Math.random() - 0.5).slice(0, 8);
  return shuffled.map(item => {
    const wrongCapitals = COUNTRIES.filter(c => c.country !== item.country).sort(() => Math.random() - 0.5).slice(0, 3).map(c => c.capital);
    const options = [item.capital, ...wrongCapitals].sort(() => Math.random() - 0.5);
    return { country: item.country, options, correct: options.indexOf(item.capital) };
  });
};

export function GeographyMinigame({ onComplete }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
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
          <h2 className="text-2xl font-bold text-foreground">World Capitals</h2>
          <p className="text-muted-foreground">Match countries to their capital cities!</p>
        </div>
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Globe className="w-10 h-10 text-primary" />
        </div>
        <Button onClick={() => setStarted(true)} size="lg" data-testid="button-start-minigame">Start Geography</Button>
      </Card>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / questions.length) * 100);
    return (
      <Card className="p-8 text-center space-y-6 pop-in" data-testid="card-minigame-result">
        <h2 className="text-2xl font-bold text-foreground">Geography Complete!</h2>
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
        <div className="text-sm text-muted-foreground">Country {currentIndex + 1} of {questions.length}</div>
        <div className={cn("text-2xl font-bold", timeLeft <= 10 ? "text-destructive shake" : "text-foreground")}>{timeLeft}s</div>
      </div>
      <div className="text-center space-y-6">
        <div className="p-6 bg-primary/10 rounded-lg">
          <p className="text-2xl font-bold text-foreground" data-testid="text-country">{current?.country}</p>
        </div>
        <p className="text-muted-foreground">What is the capital city?</p>
        <div className="grid grid-cols-2 gap-3">
          {current?.options.map((option, i) => (
            <Button key={i} onClick={() => handleAnswer(i)} variant="outline" size="lg" data-testid={`button-option-${i}`}>
              {option}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
